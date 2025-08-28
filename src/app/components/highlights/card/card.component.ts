import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-card-highlight',
  standalone: true,
  imports: [CommonModule, NzTagModule, NzStatisticModule, NzGridModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardHighlightComponent implements OnInit, OnDestroy {
  dateStart: Date = new Date('2025-08-27T03:00:56.370Z'); // início da promoção
  dateEnd: Date = new Date('2025-08-27T23:00:56.370Z'); // fim da promoção

  dateNow: Date = new Date();
  porcentageToEnd = 100;
  timeRemaining = '';
  ended = false;

  private sub?: Subscription;

  ngOnInit(): void {
    this.updateProgress(); // primeira atualização imediata
    this.sub = interval(1000).subscribe(() => this.updateProgress()); // tick a cada 1s
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private updateProgress() {
    this.dateNow = new Date();

    // se já acabou, fixa estado e para o intervalo
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

  private calculatePorcentageToEnd() {
    const totalDuration = this.dateEnd.getTime() - this.dateStart.getTime();
    const elapsed = this.dateNow.getTime() - this.dateStart.getTime();

    // trata casos antes do início
    const clampedElapsed = Math.max(0, Math.min(totalDuration, elapsed));

    this.porcentageToEnd =
      totalDuration > 0 ? (clampedElapsed / totalDuration) * 100 : 100;

    // arredonda opcionalmente
    this.porcentageToEnd = Math.max(
      0,
      Math.min(100, +this.porcentageToEnd.toFixed(2))
    );
  }

  private calculateTimeRemaining() {
    let remainingMs = this.dateEnd.getTime() - this.dateNow.getTime();
    if (remainingMs <= 0) {
      this.timeRemaining = 'Tempo encerrado';
      return;
    }

    const days = Math.floor(remainingMs / (1000 * 60 * 60 * 24));
    remainingMs -= days * (1000 * 60 * 60 * 24);

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    remainingMs -= hours * (1000 * 60 * 60);

    const minutes = Math.floor(remainingMs / (1000 * 60));
    const seconds = Math.floor((remainingMs - minutes * 60_000) / 1000);

    // você pode omitir `days` se for 0; aqui deixei completo
    this.timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
