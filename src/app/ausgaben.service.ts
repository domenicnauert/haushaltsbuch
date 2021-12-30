import { Injectable } from '@angular/core';
import Backendless from 'backendless';

export class Ausgabe {
  id: number | undefined;
  faelligkeit: Date | undefined;
  art: string | undefined;
  betrag: number | undefined;
  sender: string | undefined;
  empfaenger: string | undefined;
  kategorie: string | undefined;
  zyklus: string | undefined;
  monatlich: number | undefined;
  quartalsweise: number | undefined;
  jaehrlich: number | undefined;
}

const AusgabenStore = Backendless.Data.of('Ausgabe');

const ELEMENT_DATA: Ausgabe[] = [
  {
    id: 1,
    faelligkeit: new Date(),
    art: 'hahah',
    betrag: 100,
    sender: 'N26',
    empfaenger: 'Extern',
    kategorie: 'Abos',
    zyklus: 'm',
    monatlich: 100,
    quartalsweise: 400,
    jaehrlich: 1200,
  },
  {
    id: 4,
    faelligkeit: new Date(),
    art: 'heheh',
    betrag: 200,
    sender: 'N26',
    empfaenger: 'Extern',
    kategorie: 'Abos',
    zyklus: 'm',
    monatlich: 200,
    quartalsweise: 800,
    jaehrlich: 2400,
  },
];

@Injectable({
  providedIn: 'root',
})
export class AusgabenService {
  constructor() {}

  public ausgaben: Ausgabe[] = [];

  async loadAll() {
    return AusgabenStore.find<Ausgabe>().then((ausgaben: Ausgabe[]) => {
      this.ausgaben = ausgaben as Ausgabe[];
    });
  }
}
