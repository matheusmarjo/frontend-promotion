import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { HighlightsComponent } from '../../components/highlights/highlights.component';
import { PromotionService } from '../../services/promotion.service';
import { CategoryService } from '../../services/category.service';
import { PromotionI } from '../../interfaces/promotion.interface';
import { CategoryI } from '../../interfaces/category.interface';
import { CardVerticalComponent } from '../../components/card-vertical/card-vertical.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HighlightsComponent,
    NgClass,
    CardVerticalComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loadingPromotions = false;
  loadingCategories = false;

  allPromotions: PromotionI[] = [];
  allCategories: CategoryI[] = [];
  selectedCategory: string = '1';

  categoryAll: CategoryI = {
    id: '1',
    name: 'Todos',
    url_image: '',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  constructor(
    private promotionService: PromotionService,
    private categoryService: CategoryService
  ) {
    this.loadPromotions();
    this.loadCategories();
  }

  loadPromotions(categoryId?: string): void {
    if(categoryId) this.loadFindPromotions(categoryId);
    else this.loadAllPromotions();
  }

  loadFindPromotions(categoryId: string): void {
    this.loadingPromotions = true;
    this.promotionService.getByCategory({ categoryId }).subscribe({
      next: (promotions) => {
        this.allPromotions = promotions;
        this.loadingPromotions = false;
      },
      error: (err) => {
        console.error('Erro ao carregar promoções por categoria:', err);
        this.loadingPromotions = false;
      }
    });
  }

  loadAllPromotions(): void {
    this.loadingPromotions = true;
    this.promotionService.getAll().subscribe({
      next: (promotions) => {
        // Adiciona a categoria "Todos" ao início do array
        this.allPromotions = promotions;
        this.loadingPromotions = false;
      },
      error: (err) => {
        console.error('Erro ao carregar promoções:', err);
        this.loadingPromotions = false;
      }
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.allCategories = [this.categoryAll, ...categories];
        this.loadingCategories = false;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.loadingCategories = false;
      }
    });
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.filterPromotions(categoryId);
  }

  private filterPromotions(categoryId: string): void {
    if (categoryId === this.categoryAll.id) {
      this.loadPromotions();
    } else {
      this.loadPromotions(categoryId);
    }
  }
}
