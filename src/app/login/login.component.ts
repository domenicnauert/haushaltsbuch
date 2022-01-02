import { HttpHeaders } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    ngZone: NgZone,
    private _snackBar: MatSnackBar
  ) {
    (window as any)['onSignIn'] = (user: any) =>
      ngZone.run(() => this.onSignIn(user));
  }

  afterSignUp(user: any) {
    console.log(user);
  }

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
    setTimeout(() => {
      if (this.loginService.registered) {
        this.openSnackBar(
          'Erfolgreich registiert. Bestätige die EMail!',
          'Ok!'
        );
        this.flgRegistration = false;
      } else {
        this.openSnackBar(
          'Registierung fehlgeschlagen. Prüfe deine Eingaben.',
          'Ok!'
        );
      }
    }, 1000);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);

    // this._snackBar.openFromComponent(Snackbaromponent, {
    //   duration: 5* 1000,
    // });
  }

  public onSignIn(googleUser: any): void {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
  }
}

function onSignIn(googleUser: any) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}
