import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EnumMapper } from '../model/enumMapper';
import { PositionService } from '../shared/position.service';
import { Position } from './../model/position';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);


@Component({
  selector: 'app-n26',
  templateUrl: './n26.component.html',
  styleUrls: ['./n26.component.scss'],
})
export class N26Component implements OnInit {
  public ausgabenGesamt: number = 0;
  public ausgabenObj = {};

  public einnahmenGesamt: number = 0;
  public einnahmenObj = {};

  constructor(
    
  ) {
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
}
