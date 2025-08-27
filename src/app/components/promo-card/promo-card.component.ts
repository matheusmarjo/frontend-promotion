import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-promo-card',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './promo-card.component.html',
  styleUrl: './promo-card.component.scss'
})
export class PromoCardComponent {
}
