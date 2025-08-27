import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { CardHighlightComponent } from './card/card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-highlights',
  imports: [
    CommonModule,
    CardHighlightComponent,
    NzButtonModule,
    NzIconModule,
  ],
  templateUrl: './highlights.component.html',
  styleUrl: './highlights.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HighlightsComponent {
  @ViewChild('swiperEl', { static: true }) swiperEl!: ElementRef;

  slideNext() {
    const swiper = this.swiperEl.nativeElement.swiper;
    swiper.slideNext();
  }

  slidePrev() {
    const swiper = this.swiperEl.nativeElement.swiper;
    swiper.slidePrev();
  }
}
