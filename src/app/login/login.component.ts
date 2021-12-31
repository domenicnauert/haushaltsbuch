import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private loginService: LoginService
  ) {}

  flgRegistration: boolean = false;

  user!: string;
  password!: string;
  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  ngOnInit(): void {}

  login() {
    this.loginService.login(this.user, this.password);
  }

  registrieren() {
    this.loginService.registrieren(this.user, this.password);
  }
}
