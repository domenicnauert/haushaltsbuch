import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, ViewChild } from '@angular/core';
import { N26EinnahmenComponent } from './n26-einnahmen/n26-einnahmen.component';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-n26',
  templateUrl: './n26.component.html',
  styleUrls: ['./n26.component.scss'],
})
export class N26Component {
  public ausgabenGesamt: number = 0;
  public ausgabenObj = {};

  public einnahmenGesamt: number = 0;
  public einnahmenObj = {};

  @ViewChild(N26EinnahmenComponent)
  einnahmenComp!: N26EinnahmenComponent;

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
