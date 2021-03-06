import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

import { ISeat } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private filmURL = `//localhost:8080/api/film.svc`;
  private sessionURL = `//localhost:8080/api/session.svc`;
  private placeURL = `//localhost:8080/api/place.svc`;

  constructor(private httpClient: HttpClient) { }

  public filmCollection(offset: number): Observable<any> {
    const params = new HttpParams().set(`offset`, offset.toString());
    return this.httpClient.get(this.filmURL + `/Films`, {params});
  }

  public oneFilm(id: number): Observable<any> {
    return this.httpClient.get(this.filmURL + `/Film(` + id + `)`);
  }

  public sessionCollection(film_id: number, offset: number): Observable<any> {
    const params = new HttpParams().set(`offset`, offset.toString());
    return this.httpClient.get(this.sessionURL + `/Sessions(` + film_id + `)`, {params});
  }

  public showSeats(room_number: number): Observable<any> {
    return this.httpClient.get(this.placeURL + `/Places(` + room_number + `)`);
  }

  public updateSeat(seat: ISeat): Observable<any> {
    return this.httpClient.put(this.placeURL + `/Place`, seat);
  }
}
