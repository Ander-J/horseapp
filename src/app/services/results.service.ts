import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Horse } from '../model/horse';
import { Results } from '../model/results';
import { HorseService } from './horse.service';

@Injectable({
  providedIn: 'root'
})
export class ResultsService {
  resultsData: Results[] = [];
  private apiUrl = 'https://horseappv1-4f5hrwpfca-uc.a.run.app/api/result'
  /* private apiUrl = 'http://localhost:8080/api/result' */

  constructor(private horseService: HorseService, private http: HttpClient) { }

  getById(resultsId: string): Observable<Results> {
    return this.http
      .get<Results>(`${this.apiUrl}/${resultsId}`)
      .pipe(map(data => data), catchError(this.handleError))
  }

  getAll() {
    return this.resultsData
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(catchError(this.handleError))
  }

  updateFromDb(): Observable<Results[]> {
    let obsData: Observable<Results[]>;
    obsData = this.http
      .get<Results[]>(this.apiUrl)
      .pipe(map(data => data), catchError(this.handleError))
    obsData.subscribe(resultsList => this.resultsData = resultsList)

    return obsData
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return throwError(res.error || 'Server error');
  }
}
