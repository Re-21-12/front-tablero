import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private _httpClient  = inject(HttpClient);
  private _baseUrl = environment.dev.apiUrl;

  post<T>(url: string, body: any): Observable<T> {
    return this._httpClient.post<T>(`${this._baseUrl}${url}`, body);
  }
  get<T>(url: string): Observable<T> {
    return this._httpClient.get<T>(`${this._baseUrl}${url}`);
  }
}
