import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SparkasseEinnahmenComponent } from './sparkasse-einnahmen/sparkasse-einnahmen.component';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-sparkasse',
  templateUrl: './sparkasse.component.html',
  styleUrls: ['./sparkasse.component.scss'],
})
export class SparkasseComponent implements OnInit {
  public ausgabenGesamt: number = 0;
  public ausgabenObj = {};

  public einnahmenGesamt: number = 0;
  public einnahmenObj = {};

  @ViewChild(SparkasseEinnahmenComponent)
  einnahmenComp!: SparkasseEinnahmenComponent;

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
