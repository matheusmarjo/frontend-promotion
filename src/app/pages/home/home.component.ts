import { Component } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { HighlightsComponent } from '../../components/highlights/highlights.component';
import { PromotionService } from '../../services/promotion.service';
import { CategoryService } from '../../services/category.service';
import { PromotionI } from '../../interfaces/promotion.interface';
import { CategoryI } from '../../interfaces/category.interface';
import { CardVerticalComponent } from '../../components/card-vertical/card-vertical.component';
import { MatIconModule } from '@angular/material/icon';
import { BannerComponent } from '../../components/banner/banner.component';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SkeletonCardHorizontalComponent } from '../../components/skeleton/card/horizontal/horizontal.component';
import { SkeletonCardVerticalComponent } from '../../components/skeleton/card/vertical/vertical.component';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    HighlightsComponent,
    NgClass,
    CardVerticalComponent,
    MatIconModule,
    BannerComponent,
    FormsModule, 
    NzButtonModule, 
    NzInputModule,
    NzIconModule,
    SkeletonCardHorizontalComponent,
    SkeletonCardVerticalComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loadingPromotions = false;
  loadingCategories = false;

  allPromotions: PromotionI[] = [];
  filteredPromotions: PromotionI[] = [];
  allHighlightPromotions: PromotionI[] = [];

  allCategories: CategoryI[] = [];
  selectedCategory: string = '1';
  searchTerm: string = '';

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
    if (categoryId) this.loadFindPromotions(categoryId);
    else this.loadAllPromotions();
  }

  loadFindPromotions(categoryId: string): void {
    this.loadingPromotions = true;
    this.promotionService.getByCategory({ categoryId }).subscribe({
      next: (promotions) => {
        this.allPromotions = promotions;
        this.applyFilters();
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
        this.allPromotions = promotions;
        this.applyFilters();
        this.loadingPromotions = false;
        this.allHighlightPromotions = promotions.filter(promo => promo.isHighlight);
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

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredPromotions = this.allPromotions.filter(promo =>
      promo.title.toLowerCase().includes(term) ||
      (promo.rule?.toLowerCase().includes(term)) // exemplo extra
    );
  }
}

