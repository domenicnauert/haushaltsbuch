import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component } from '@angular/core';
import { LoginService } from './shared/login.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Haushaltsbuch';
  updated = 0;

  constructor(public loginService: LoginService) {}

  logout() {
    this.loginService.logout();
    this.loginService.loggedIn;
  }

  handleDBUpdate(event: number) {
    this.updated = event;
  }

  reload() {
    window.location.reload();
  }
}
