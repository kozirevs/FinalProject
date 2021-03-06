import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {IFilm, ISeat, ISession, IOrder} from '../app.component';
import {ApiService} from '../api.service';
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-film-session',
  templateUrl: './film-session.component.html',
  styleUrls: ['./film-session.component.css']
})
export class FilmSessionComponent {
  selected_seats: Array<number> = [];
  sessions: Array<ISession> = [];
  seats: Array<ISeat> = [];
  current_page: number = 0;

  selectedSession: ISession = {
    id: 0,
    date_time: '',
    room: 0,
    price: 0,
    film_id: 0
  };

  selectedFilm: IFilm = {
    id: 0,
    length: '',
    picture: '',
    title: ''
  };

  order: IOrder = {
    film: '',
    session_date: '',
    room: 0,
    places: '',
    generation_time: '',
    total_price: 0
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.selectedFilm.id = Number.parseInt(this.route.snapshot.paramMap.get('id'), 0);
    apiService.oneFilm(this.selectedFilm.id)
      .subscribe(result => this.selectedFilm = result);

    apiService.sessionCollection(this.selectedFilm.id, this.current_page)
      .subscribe(result => result.forEach(data => this.sessions.push(data)));
  }

  private init(): void {
      this.sessions.splice(0);
      this.selected_seats.splice(0);
      this.selectedSession.id = 0;
  }

  onSessionSelect(session: ISession): void {
    this.seats.splice(0);
    this.selected_seats.splice(0);
    this.seats.forEach(s => s.available = false);
    this.selectedSession = session;

    this.apiService.showSeats(this.selectedSession.room)
      .subscribe(result =>
        result.forEach(data => this.seats.push(data))
      );
  }

  onSeatSelect(event: any, seat: ISeat): void {
    const selectedNumber: number = Number.parseInt(event.target.text, 0);
    this.seats.forEach(_seat => {
        if(_seat == seat && !_seat.enabled) {
          _seat.available = !_seat.available;
          seat = _seat;

          if(seat.available) {
            this.selected_seats.push(seat.place_number);
          } else if(!seat.available) {
              const ind = this.selected_seats.indexOf(seat.place_number);
              this.selected_seats.splice(ind, 1);
          }
        }
      });
  }

  pageUp(): void {
    this.init();
    this.current_page > 0 ? this.current_page = 1 : this.current_page ++ ;
    this.apiService.sessionCollection(this.selectedFilm.id, this.current_page)
      .subscribe(result => result.forEach(data => this.sessions.push(data)));
  }

  pageDown(): void {
    this.init();
    this.current_page <= 0 ? this.current_page = 0 : this.current_page -- ;
    this.apiService.sessionCollection(this.selectedFilm.id, this.current_page)
      .subscribe(result => result.forEach(data => this.sessions.push(data)));
  }

  makeOrder(): void {
    this.order.film = this.selectedFilm.title;
    this.order.session_date = this.selectedSession.date_time;
    this.order.room = this.selectedSession.room;
    this.order.places = this.selected_seats.join(',\xa0');
    this.order.total_price = this.selected_seats.length * this.selectedSession.price;
    this.order.generation_time = this.datePipe
      .transform(new Date(), 'dd.MM.yyyy hh:mm:ss');

  }

  approveOrder(): void {
    this.seats.forEach(seat => this.apiService.updateSeat(seat).subscribe());
    this.router.navigate(['']).then(() => console.log());
  }
}
