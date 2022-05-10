import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Bet } from '../model/bet';

@Injectable({
  providedIn: 'root'
})
export class BetService {

  private apiUrl = 'https://horseappv1-4f5hrwpfca-uc.a.run.app/api/bet'
  /* private apiUrl = 'http://localhost:8080/api/bet' */
  constructor(private http: HttpClient) { }

  /* getAll(): Bet[] {
    return this.betData
  } */

  betExists(betId: string) {
    this.updateFromDb().subscribe(data => {
      for (var bet of data) {
        if (bet.raceId == betId) {
          return true
        }
      }
      return false
    })
  }

  getById(betId: string): Observable<Bet> {
    return this.http
      .get<Bet>(`${this.apiUrl}/${betId}`)
      .pipe(map(data => data), catchError(this.handleError))
  }

  post(data: Bet) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return this.http.post<Bet>(`${this.apiUrl}/new`, data).pipe(catchError(this.handleError));
  }

  updateFromDb(): Observable<Bet[]> {
    return this.http
      .get<Bet[]>(this.apiUrl)
      .pipe(map(data => data), catchError(this.handleError))
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return throwError(res.error || 'Backend error');
  }

}
