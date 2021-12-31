import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  user?: string;
  password?: string;
  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  ngOnInit(): void {}

  login() {
    console.log(this.user);
    console.log(this.password);

    this.http
      .post<any>(
        'https://freecredit.backendless.app/api/users/login',
        { login: this.user, password: this.password },
        this.options
      )
      .subscribe((data) => {
        console.log(data);
        this.router.navigate(['startseite']);
      });
  }
}
