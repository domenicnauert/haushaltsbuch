import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public flgRegistration: boolean = false;
  public email!: string;
  public password!: string;

  constructor(
    private loginService: LoginService,
    private _snackBar: MatSnackBar
  ) {}

  login() {
    this.loginService.login(this.email, this.password);
  }

  registrieren() {
    this.loginService.registrieren(this.email, this.password);
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

  private openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);

    //custom Snackbar
    // this._snackBar.openFromComponent(Snackbaromponent, {
    //   duration: 5* 1000,
    // });
  }
}
