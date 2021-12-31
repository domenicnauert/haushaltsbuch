import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Ausgabe } from './ausgabe';

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
      ausgaben = ausgaben.sort((a, b) => a.id! - b.id!);
      this.ausgaben = ausgaben;
    });
  }

  add(newAusgabe: Ausgabe) {
    return AusgabenStore.save<Ausgabe>(newAusgabe).then(
      (savedAusgabe: Ausgabe) => {
        this.ausgaben.push(savedAusgabe);
      }
    );
  }

  delete(deleteAusgabe: Ausgabe) {
    AusgabenStore.remove(deleteAusgabe.objectId!).then(() => {
      this.ausgaben = this.ausgaben.filter(
        (_, i) => i !== this.ausgaben.indexOf(deleteAusgabe)
      );
    });

    return deleteAusgabe.id;
  }

  update(updateAusgabe: Ausgabe) {
    return AusgabenStore.save<Ausgabe>(updateAusgabe).then(
      (updatedAusgabe: Ausgabe) => {
        this.ausgaben.map((ausgabe) => {
          let el = ausgabe as Ausgabe;
          if (el.id == updateAusgabe.id) {
            return Object.assign({}, el, updateAusgabe);
          }
          return el;
        });
      }
    );
  }
}
