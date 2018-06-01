import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, StateProxyService } from 'state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public user$: Observable<IUser>;

  constructor(private store: StateProxyService) {}

  public ngOnInit(): void {
    this.user$ = this.store.select<IUser>('user');
  }
}
