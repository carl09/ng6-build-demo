import { Component, OnInit } from '@angular/core';
import { LogoffAction, StateProxyService } from 'state';

@Component({
  selector: 'app-user-logoff',
  templateUrl: './logoff.component.html',
})
export class LogoffComponent implements OnInit {
  constructor(private store: StateProxyService) {}

  public ngOnInit(): void {
    this.store.dispatch(new LogoffAction());
  }
}
