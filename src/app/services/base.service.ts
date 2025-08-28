import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  public path = '';

  constructor(public httpClient: HttpClient) {}

  getBaseUrl(): string {
    return EnvironmentService.getBackendEndUrl();
  }
}
