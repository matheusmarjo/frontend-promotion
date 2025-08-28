import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { PromotionI } from '../../interfaces/promotion.interface';
import { Subscription, interval } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-vertical',
  // se for standalone, adicione: standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './card-vertical.component.html',
  styleUrls: ['./card-vertical.component.scss']
})
export class CardVerticalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data!: PromotionI;

  dateStart?: Date;
  dateEnd?: Date;

  dateNow: Date = new Date();
  porcentageToEnd = 100;
  timeRemaining = '';
  ended = false;
  notStarted = false;

  private sub?: Subscription;

  ngOnInit(): void {
    this.applyDatesFromInput();
    this.startTicker();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.applyDatesFromInput();
      this.updateProgress(); // atualiza imediatamente com o novo input
    }
  }

  ngOnDestroy(): void {
    this.stopTicker();
  }

  private applyDatesFromInput() {
    // Proteções contra input indefinido
    const sd = this.data?.start_date;
    const ed = this.data?.end_date;

    this.dateStart = sd ? new Date(sd) : undefined;
    this.dateEnd = ed ? new Date(ed) : undefined;
  }

  private startTicker() {
    this.stopTicker();
    // atualiza agora e a cada 1s
    this.updateProgress();
    this.sub = interval(1000).subscribe(() => this.updateProgress());
  }

  private stopTicker() {
    this.sub?.unsubscribe();
    this.sub = undefined;
  }

  private updateProgress() {
    this.dateNow = new Date();

    // Sem datas válidas, não há o que calcular
    if (!this.dateStart || !this.dateEnd || isNaN(this.dateStart.getTime()) || isNaN(this.dateEnd.getTime())) {
      this.ended = false;
      this.notStarted = false;
      this.porcentageToEnd = 100;
      this.timeRemaining = 'Período não definido';
      return;
    }

    // Ainda não começou
    if (this.dateNow < this.dateStart) {
      this.notStarted = true;
      this.ended = false;
      this.porcentageToEnd = 0;
      this.timeRemaining = this.formatRemaining(this.dateStart.getTime() - this.dateNow.getTime(), 'Começa em');
      return;
    }

    // Já terminou
    if (this.dateNow >= this.dateEnd) {
      this.ended = true;
      this.notStarted = false;
      this.porcentageToEnd = 100;
      this.timeRemaining = 'Tempo encerrado';
      this.stopTicker(); // para a contagem
      return;
    }

    // Em andamento
    this.notStarted = false;
    this.ended = false;
    this.calculatePercentageToEnd();
    this.timeRemaining = this.formatRemaining(this.dateEnd.getTime() - this.dateNow.getTime(), 'Termina em');
  }

  private calculatePercentageToEnd() {
    if (!this.dateStart || !this.dateEnd) return;

    const totalDuration = this.dateEnd.getTime() - this.dateStart.getTime();
    const elapsed = this.dateNow.getTime() - this.dateStart.getTime();

    const clampedElapsed = Math.max(0, Math.min(totalDuration, elapsed));
    const pct = totalDuration > 0 ? (clampedElapsed / totalDuration) * 100 : 100;

    this.porcentageToEnd = Math.max(0, Math.min(100, +pct.toFixed(2)));
  }

  private formatRemaining(ms: number, prefix: string) {
    if (ms <= 0) return 'Tempo encerrado';

    const dayMs = 86_400_000;
    const hourMs = 3_600_000;
    const minMs = 60_000;
    const secMs = 1_000;

    const days = Math.floor(ms / dayMs); ms -= days * dayMs;
    const hours = Math.floor(ms / hourMs); ms -= hours * hourMs;
    const minutes = Math.floor(ms / minMs); ms -= minutes * minMs;
    const seconds = Math.floor(ms / secMs);

    // Oculta unidades iniciais que estejam zeradas para uma string mais limpa
    const parts: string[] = [];
    if (days) parts.push(`${days}d`);
    if (days || hours) parts.push(`${hours}h`);
    if (days || hours || minutes) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return `${prefix} ${parts.join(' ')}`;
  }
}
