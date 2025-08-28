import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError, Observable } from 'rxjs';
import { CategoryI } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService {
  private pathLogin = 'categories';

  constructor(public override httpClient: HttpClient) {
    super(httpClient);
  }

  getAll(): Observable<CategoryI[]> {
    return this.httpClient.get<CategoryI[]>(`${this.getBaseUrl()}${this.pathLogin}`).pipe(
      map((value) => {
        return value as CategoryI[];
      }),
      catchError(error => {
        return throwError(() => {
          new Error(`Erro ao buscar todas categorias: ${error.message}`);
        });
      })
    );
  }
  
}
