import { Component } from '@angular/core';
import { PromotionService } from '../../services/promotion.service';
import { ActivatedRoute } from '@angular/router';
import { PromotionI } from '../../interfaces/promotion.interface';

@Component({
  selector: 'app-detail-promo',
  imports: [],
  templateUrl: './detail-promo.component.html',
  styleUrl: './detail-promo.component.scss'
})
export class DetailPromoComponent {
  promotionId: string = '';
  dataPromotion: PromotionI = {} as PromotionI;

  constructor(
    private promotionService: PromotionService,
    private route: ActivatedRoute
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.promotionId = id;
      this.getDataPromotion();
    }
  }

  getDataPromotion() {
    this.promotionService.getById(this.promotionId).subscribe( promo => {
      this.dataPromotion = promo;
    });
  }
}
