import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {}

  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  public currentUsertoken: string = '';
  public loggedIn = false;

  login(email: string, passwort: string) {
    console.log('login test');
    Backendless.UserService.login(email, passwort)
      .then((user) => {
        console.log(user);
      })
      .then(() => {
        this.router.navigate(['startseite']);
      });
  }

  registrieren(email: string, passwort: string) {
    this.http
      .post<any>(
        'https://freecredit.backendless.app/api/users/register',
        { email: email, password: passwort },
        this.options
      )
      .subscribe((data) => {});
  }

  logout() {
    Backendless.UserService.logout().then((data) => {
      console.log(data);
      this.router.navigate(['login']);
    });
  }

  reload(token: string) {
    this.loggedIn = true;
    this.currentUsertoken = token;
  }

  private setCookie(
    name: string,
    value: string,
    expireDays: number,
    path: string = ''
  ) {
    let d: Date = new Date();
    d.setTime(d.getTime() + expireDays * 24 * 60 * 60 * 1000);
    let expires: string = `expires=${d.toUTCString()}`;
    let cpath: string = path ? `; path=${path}` : '';
    document.cookie = `${name}=${value}; ${expires}${cpath}`;
  }

  private deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }
}
