import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { interval, Subscription } from 'rxjs';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PromotionI } from '../../../interfaces/promotion.interface';

@Component({
  selector: 'app-card-highlight',
  standalone: true,
  imports: [
    CommonModule,
    NzTagModule,
    NzStatisticModule,
    NzGridModule,
    NzFlexModule,
    NzButtonModule,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'], // <- corrige para array
})
export class CardHighlightComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data!: PromotionI;

  // Tipagens explícitas
  dateStart?: Date; // início da promoção
  dateEnd?: Date;   // fim da promoção

  dateNow: Date = new Date();
  porcentageToEnd: number = 100;
  timeRemaining: string = '';
  ended: boolean = false;

  private sub?: Subscription;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.dateStart = this.data.start_date ? new Date(this.data.start_date) : undefined;
      this.dateEnd   = this.data.end_date   ? new Date(this.data.end_date)   : undefined;
      // Recalcula sempre que o input mudar
      this.updateProgress();
    }
  }

  ngOnInit(): void {
    this.updateProgress(); // primeira atualização imediata
    this.sub = interval(1000).subscribe(() => this.updateProgress()); // tick a cada 1s
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateProgress(): void {
    this.dateNow = new Date();

    // Se não houver fim definido, não há como calcular contagem regressiva/percentual
    if (!this.dateEnd) {
      this.ended = false;
      this.porcentageToEnd = 0;
      this.timeRemaining = 'Sem data de término';
      return;
    }

    // Já acabou?
    if (this.dateNow >= this.dateEnd) {
      this.ended = true;
      this.porcentageToEnd = 100;
      this.timeRemaining = 'Tempo encerrado';
      this.sub?.unsubscribe(); // para a contagem
      return;
    }

    this.calculatePorcentageToEnd();
    this.calculateTimeRemaining();
  }

  private calculatePorcentageToEnd(): void {
    // Se não tiver início, considera progresso a partir de "agora até o fim"
    if (!this.dateEnd) {
      this.porcentageToEnd = 0;
      return;
    }

    if (!this.dateStart) {
      // Sem início -> considera que ainda não começou (0%)
      this.porcentageToEnd = 0;
      return;
    }

    const totalDuration = this.dateEnd.getTime() - this.dateStart.getTime();
    const elapsed = this.dateNow.getTime() - this.dateStart.getTime();

    if (totalDuration <= 0) {
      this.porcentageToEnd = 100;
      return;
    }

    const clampedElapsed = Math.max(0, Math.min(totalDuration, elapsed));
    const pct = (clampedElapsed / totalDuration) * 100;

    this.porcentageToEnd = Math.max(0, Math.min(100, +pct.toFixed(2)));
  }

  private calculateTimeRemaining(): void {
    if (!this.dateEnd) {
      this.timeRemaining = 'Sem data de término';
      return;
    }

    let remainingMs = this.dateEnd.getTime() - this.dateNow.getTime();
    if (remainingMs <= 0) {
      this.timeRemaining = 'Tempo encerrado';
      return;
    }

    const dayMs = 1000 * 60 * 60 * 24;
    const hourMs = 1000 * 60 * 60;
    const minMs = 1000 * 60;

    const days = Math.floor(remainingMs / dayMs);
    remainingMs -= days * dayMs;

    const hours = Math.floor(remainingMs / hourMs);
    remainingMs -= hours * hourMs;

    const minutes = Math.floor(remainingMs / minMs);
    const seconds = Math.floor((remainingMs - minutes * minMs) / 1000);

    this.timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  get statusInfo(): { text: string; color: string } {
    const now = this.dateNow;
  
    if (this.dateEnd && now >= this.dateEnd) {
      return { text: 'Encerrado', color: '#fff1f0' }; // vermelho
    }
    if (this.dateStart && now < this.dateStart) {
      return { text: 'Em breve', color: '#e6fffb' }; // azul
    }
    if (this.dateStart && now >= this.dateStart && (!this.dateEnd || now < this.dateEnd)) {
      return { text: 'Iniciado', color: '#f6ffed' }; // verde
    }
    return { text: 'Indeterminado', color: '#f9f0ff' }; // cinza
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
  
  private startOfDay(d: Date): Date {
    const nd = new Date(d);
    nd.setHours(0, 0, 0, 0);
    return nd;
  }
  
  private addDays(d: Date, days: number): Date {
    const nd = new Date(d);
    nd.setDate(nd.getDate() + days);
    return nd;
  }
  
  private formatTimeHHmm(d: Date): string {
    // HH:mm no locale pt-BR, 24h
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  
  private formatDateDDMM(d: Date): string {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
  
  /** "Hoje às HH:mm" | "Ontem às HH:mm" | "Amanhã às HH:mm" | "dd/mm HH:mm" */
  private formatRelativeDateTime(d: Date): string {
    const today = this.startOfDay(this.dateNow);
    const target = this.startOfDay(d);
    const yesterday = this.addDays(today, -1);
    const tomorrow = this.addDays(today, 1);
  
    const time = this.formatTimeHHmm(d);
  
    if (this.isSameDay(target, today)) return `Hoje às ${time}`;
    if (this.isSameDay(target, yesterday)) return `Ontem às ${time}`;
    if (this.isSameDay(target, tomorrow)) return `Amanhã às ${time}`;
  
    return `${this.formatDateDDMM(d)} ${time}`;
  }
  
  formattedString(): string {
    if (this.dateStart && !this.dateEnd) {
      return `A partir de ${this.formatRelativeDateTime(this.dateStart)}`;
    } else if (!this.dateStart && this.dateEnd) {
      return `Até ${this.formatRelativeDateTime(this.dateEnd)}`;
    } else if (this.dateStart && this.dateEnd) {
      return `De ${this.formatRelativeDateTime(this.dateStart)} até ${this.formatRelativeDateTime(this.dateEnd)}`;
    } else {
      return 'Indeterminado';
    }
  }
}
