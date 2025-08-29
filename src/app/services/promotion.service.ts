import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError, throwError, Observable } from 'rxjs';
import { PromotionI } from '../interfaces/promotion.interface';

@Injectable({
  providedIn: 'root',
})
export class PromotionService extends BaseService {
  private pathLogin = 'promotions';

  constructor(public override httpClient: HttpClient) {
    super(httpClient);
  }

  getAll(): Observable<PromotionI[]> {
    return this.httpClient.get<PromotionI[]>(`${this.getBaseUrl()}${this.pathLogin}`).pipe(
      map((value) => {
        return value as PromotionI[];
      }),
      catchError(error => {
        return throwError(() => {
          new Error(`Erro ao buscar todas promoções: ${error.message}`);
        });
      })
    );
  }

  getByCategory(data: { categoryId?: string; id?: string, statusId?: string }): Observable<PromotionI[]> {
    let params = new HttpParams();

    if (data.id) {
      params = params.set('id', data.id);
    }

    if (data.statusId) {
      params = params.set('statusId', data.statusId);
    }

    if (data.categoryId) {
      params = params.set('categoryId', data.categoryId);
    }

    return this.httpClient.get<PromotionI[]>(`${this.getBaseUrl()}${this.pathLogin}/search`, { params }).pipe(
      map((value) => {
        return value as PromotionI[];
      }),
      catchError(error => {
        return throwError(() => {
          new Error(`Erro ao buscar promoções por categoria: ${error.message}`);
        });
      })
    );
  }

  getById(id: string): Observable<PromotionI> {
    return this.httpClient.get<PromotionI>(`${this.getBaseUrl()}${this.pathLogin}/${id}`).pipe(
      map((value) => {
        return value as PromotionI;
      }),
      catchError(error => {
        return throwError(() => {
          new Error(`Erro ao buscar promoção por ID: ${error.message}`);
        });
      })
    );
  }
}
