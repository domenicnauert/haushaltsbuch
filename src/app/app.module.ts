import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDateFormats,
  MatNativeDateModule,
  MatRippleModule,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import Backendless from 'backendless';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AusgabenComponent } from './ausgaben/ausgaben.component';
import { CreatePositionComponent } from './create-ausgabe/create-position.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepotsComponent } from './depots/depots.component';
import { EinnahmenComponent } from './einnahmen/einnahmen.component';
import { LoginComponent } from './login/login.component';
import { N26Component } from './n26/n26.component';
import { Snackbaromponent } from './snackbar/snackbar.component';
import { SparkasseComponent } from './sparkasse/sparkasse.component';
import { SparkontenComponent } from './sparkonten/sparkonten.component';
import { VolksbankAusgabenComponent } from './volksbank-ausgaben/volksbank-ausgaben.component';
import { VolksbankDifferenzComponent } from './volksbank-differenz/volksbank-differenz.component';
import { VolksbankEinnahmenComponent } from './volksbank-einnahmen/volksbank-einnahmen.component';
import { VolksbankComponent } from './volksbank/volksbank.component';

Backendless.initApp(
  environment.backendless.APP_ID,
  environment.backendless.API_KEY
);

export const GRI_DATE_FORMATS: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: {
      month: 'long',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AusgabenComponent,
    CreatePositionComponent,
    LoginComponent,
    Snackbaromponent,
    VolksbankComponent,
    DepotsComponent,
    N26Component,
    SparkontenComponent,
    SparkasseComponent,
    EinnahmenComponent,
    VolksbankEinnahmenComponent,
    VolksbankAusgabenComponent,
    VolksbankDifferenzComponent
  ],
  imports: [
    BrowserModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSnackBarModule,
    MatMenuModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSortModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'de-DE',
    },
    { provide: MAT_DATE_FORMATS, useValue: GRI_DATE_FORMATS },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
