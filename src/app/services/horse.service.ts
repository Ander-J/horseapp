import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Horse } from '../model/horse';

@Injectable({
  providedIn: 'root'
})
export class HorseService {
  horseData: Horse[] = [];
  private apiUrl = 'https://horseappv1-4f5hrwpfca-uc.a.run.app/api/horse'
  /* private apiUrl = 'http://localhost:8080/api/horse' */

  constructor(private http: HttpClient) { }

  getById(horseId: string): Observable<Horse> {
    return this.http
      .get<Horse>(`${this.apiUrl}/${horseId}`)
      .pipe(map(data => data), catchError(this.handleError))
  }

  getAll() {
    return this.horseData
  }

  getHorses(array: string[]) {
    var horseList: Array<Horse> = []
    this.updateFromDb().subscribe(data => {
      for (var horse of data) {
        if (array.indexOf(horse.id) !== -1) {
          horseList.push(horse)
        }
      }
    })
    return horseList
  }

  updateFromDb(): Observable<Horse[]> {
    let obsData: Observable<Horse[]>;
    obsData = this.http
      .get<Horse[]>(this.apiUrl)
      .pipe(map(data => data), catchError(this.handleError))
    obsData.subscribe(horseList => this.horseData = horseList)

    return obsData
  }

  post(data: Horse) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json')
    return this.http.post<Horse>(`${this.apiUrl}/new`, data).pipe(catchError(this.handleError));
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return throwError(res.error || 'Server error');
  }
}


