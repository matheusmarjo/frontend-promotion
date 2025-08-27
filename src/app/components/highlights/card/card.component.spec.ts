import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHighlightComponent } from './card.component';

describe('CardHighlightComponent', () => {
  let component: CardHighlightComponent;
  let fixture: ComponentFixture<CardHighlightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHighlightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardHighlightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
