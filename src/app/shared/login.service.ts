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

  private currentUsertoken: string = '';

  login(email: string, passwort: string) {
    this.http
      .post<any>(
        'https://freecredit.backendless.app/api/users/login',
        { login: email, password: passwort },
        this.options
      )
      .subscribe((data) => {
        console.log(data['user-token']);
        this.currentUsertoken = data['user-token'];
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
      .subscribe((data) => {
        console.log(data);
      });
  }

  logout() {
    console.log(this.currentUsertoken);

    const optionsLogout = {
      headers: new HttpHeaders().set('user-token', this.currentUsertoken),
    };

    this.http
      .get<any>(
        'https://freecredit.backendless.app/api/users/logout',
        optionsLogout
      )
      .subscribe((data) => {
        console.log(data);
        this.router.navigate(['']);
      });
  }
}
