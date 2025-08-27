import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { HighlightsComponent } from '../../components/highlights/highlights.component';
import { CardHighlightComponent } from '../../components/highlights/card/card.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HeroComponent,
    HighlightsComponent,
    CardHighlightComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  cards = [1, 2, 3, 4, 5, 6];
}
