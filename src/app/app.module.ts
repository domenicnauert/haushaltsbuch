import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  MatDateFormats,
  MatNativeDateModule,
  MAT_DATE_FORMATS,
  MAT_NATIVE_DATE_FORMATS,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
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
import { CreateAusgabeComponent } from './create-ausgabe/create-ausgabe.component';
import { DashboardComponent } from './dashboard/dashboard.component';
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
