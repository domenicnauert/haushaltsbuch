import { Component } from '@angular/core';
import { LoginService } from './shared/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Haushaltsbuch';

  constructor(private loginService: LoginService) {}

  logout() {
    this.loginService.logout();
  }
}
