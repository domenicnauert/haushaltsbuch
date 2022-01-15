import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, OnInit, ViewChild } from '@angular/core';
import { VolksbankEinnahmenComponent } from './volksbank-einnahmen/volksbank-einnahmen.component';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-volksbank',
  templateUrl: './volksbank.component.html',
  styleUrls: ['./volksbank.component.scss'],
})
export class VolksbankComponent implements OnInit {
  public ausgabenGesamt: number = 0;
  public ausgabenObj = {};

  public einnahmenGesamt: number = 0;
  public einnahmenObj = {};

  @ViewChild(VolksbankEinnahmenComponent)
  einnahmenComp!: VolksbankEinnahmenComponent;

  constructor() {
    this.ausgabenObj = {
      faelligkeit: '--',
      art: 'Ausgaben',
      monatlich: this.ausgabenGesamt,
    };
    this.einnahmenObj = {
      faelligkeit: '--',
      art: 'Einnahmen',
      monatlich: this.einnahmenGesamt,
    };
  }

  ngOnInit(): void {}

  handleAusgabeChanged(event: number) {
    this.ausgabenGesamt = event;
    this.ausgabenObj = {
      faelligkeit: '--',
      art: 'Ausgaben',
      monatlich: event,
    };
  }

  handleEinnahmenChanged(event: number) {
    this.einnahmenGesamt = event;
    this.einnahmenObj = {
      faelligkeit: '--',
      art: 'Einnahmen',
      monatlich: event,
    };
  }

  handleDifferenzChanged(event: number) {
    this.einnahmenComp.handleDifferenz(event);
  }
}
