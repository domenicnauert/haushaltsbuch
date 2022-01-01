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
  public registered = false;

  login(email: string, passwort: string) {
    console.log('login test');
    Backendless.UserService.login(email, passwort)
      .then((user: any) => {
        console.log('test token');
        localStorage.setItem('token', user['user-token']);
        localStorage.getItem('token');
        console.log(Backendless.UserService.currentUser);
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
      .then( (registeredUser) =>{
        this.registered = true;
        console.log(registeredUser);
      })
      .catch( (error) => {
        this.registered = false;
      });
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
