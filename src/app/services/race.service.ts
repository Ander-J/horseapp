import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Race } from '../model/race';
import { Results } from '../model/results';
import { HorseService } from './horse.service';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  private apiUrl = 'https://horseappv1-4f5hrwpfca-uc.a.run.app/api/race'
  /* private apiUrl = 'http://localhost:8080/api/race' */

  constructor(private horseService: HorseService, private http: HttpClient) { }

  /* getAll(): Race[]{
    this.updateFromDb().subscribe(data => this.raceData = data)
    return this.raceData
  } */

  /* getById(id: string){
    this.getAll()
    if (this.raceData.length == 0){
      return null
    }
    for (var race of this.raceData){
      if (race.id == id){
        return race
      }
    }
    return null
  } */

  getById(raceId: string): Observable<Race> {
    return this.http
      .get<Race>(`${this.apiUrl}/${raceId}`)
      .pipe(map(data => data), catchError(this.handleError))
  }

  runRace(raceId: string): Observable<Results> {
    return this.http
      .get<Results>(`${this.apiUrl}/run/${raceId}`)
      .pipe(map(data => data), catchError(this.handleError))
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`).pipe(catchError(this.handleError))
  }

  updateFromDb(): Observable<Race[]> {
    return this.http
      .get<Race[]>(this.apiUrl)
      .pipe(map(data => data), catchError(this.handleError))
  }

  postNewRace(data: Race) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post<Race>(`${this.apiUrl}/new`, data).pipe(catchError(this.handleError))
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return throwError(res.error || 'Server error');
  }
}
