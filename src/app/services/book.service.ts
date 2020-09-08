import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseUrl';
import { ProcessHttpErrorMsgService } from './process-http-error-msg.service';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BOOK } from '../model/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(
    private http: HttpClient,
    private processHttpErrorMsgService: ProcessHttpErrorMsgService
  ) {}

  getBooks(): Observable<BOOK[]> {
    return this.http
      .get<BOOK[]>(`${baseURL}books`)
      .pipe(catchError(this.processHttpErrorMsgService.handleError));
  }
  updateBook(skuId: string, name: string, stocks: any): Observable<BOOK> {
    return this.http
      .put<BOOK>(`${baseURL}books/${skuId}`, { name: name, stocks: stocks })
      .pipe(catchError(this.processHttpErrorMsgService.handleError));
  }
  postBook(skuId: string, name: string, stocks: any): Observable<BOOK> {
    return this.http
      .post<BOOK>(`${baseURL}books`, {
        name: name,
        stocks: stocks,
        skuId: skuId,
      })
      .pipe(catchError(this.processHttpErrorMsgService.handleError));
  }
}
