import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private router: Router) {}

  public currentUsertoken: string = '';
  public loggedIn = false;
  public registered = false;

  login(email: string, passwort: string) {
    Backendless.UserService.login(email, passwort)
      .then((user: any) => {
        this.loggedIn = true;
        localStorage.setItem('token', user['user-token']);
      })
      .then(() => {
        this.router.navigate(['startseite']).then(() => {});
      });
  }

  registrieren(email: string, passwort: string) {
    let user = new Backendless.User();
    user.email = email;
    user.password = passwort;

    Backendless.UserService.register(user)
      .then((registeredUser) => {
        this.registered = true;
      })
      .catch((error) => {
        this.registered = false;
      });
  }

  logout() {
    Backendless.UserService.logout().then((data) => {
      this.loggedIn = false;
      localStorage.clear();
      this.router.navigate(['login']);
    });
  }

  reload() {
    let token = localStorage.getItem('token');

    if (token && token !== '') {
      Backendless.UserService.currentUser = { ___class: 'Users' };
      (Backendless.UserService.currentUser as any)['user-token'] = token;

      return (this.loggedIn = true);
    }
    return false;
  }
}
