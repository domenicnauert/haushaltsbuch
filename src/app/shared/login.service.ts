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
    this.http
      .post<any>(
        'https://freecredit.backendless.app/api/users/login',
        { login: email, password: passwort },
        this.options
      )
      .subscribe((data) => {
        this.currentUsertoken = data['user-token'];
        this.loggedIn = true;
        console.log(this.currentUsertoken);
        this.setCookie('token', this.currentUsertoken, 1, 'test');
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
    this.deleteCookie('token');

    const optionsLogout = {
      headers: new HttpHeaders().set('user-token', this.currentUsertoken),
    };

    this.http
      .get<any>(
        'https://freecredit.backendless.app/api/users/logout',
        optionsLogout
      )
      .subscribe((data) => {
        this.loggedIn = false;
        this.currentUsertoken = '';
        this.router.navigate(['']);
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
