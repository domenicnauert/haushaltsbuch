import { NgModule, CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AusgabenComponent } from './ausgaben/ausgaben.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDateFormats,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { CreateAusgabeComponent } from './create-ausgabe/create-ausgabe.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../environments/environment';
import Backendless from 'backendless';
import { LoginComponent } from './login/login.component';

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
    CreateAusgabeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
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
    MatDatepickerModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSelectModule,
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
