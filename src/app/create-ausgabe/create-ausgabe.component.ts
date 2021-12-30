import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ausgabe } from '../ausgabe';

const KATEGORIEN = [
  {
    value: undefined,
    name: '--',
  },
  {
    value: 'abos',
    name: 'Abos',
  },
  {
    value: 'fixkosten',
    name: 'Fixkosten',
  },
  {
    value: 'konsum',
    name: 'Konsum',
  },
  {
    value: 'krdite',
    name: 'Krdite',
  },
  {
    value: 'sparen',
    name: 'Sparen',
  },
  {
    value: 'versicherung',
    name: 'Versicherung',
  },
  {
    value: 'verträge',
    name: 'Verträge',
  },
];

const ZYKLEN = [
  {
    value: 'm',
  },
  {
    value: 'q',
  },
  {
    value: 'j',
  },
];

const SENDER = [
  {
    value: undefined,
    name: '--',
  },
  {
    value: 'sparkasse',
    name: 'Sparkasse',
  },
  {
    value: 'n26',
    name: 'N26',
  },
  {
    value: 'volksbank',
    name: 'Volksbank',
  },
];

const EMPFAENGER = [
  {
    value: undefined,
    name: '--',
  },
  {
    value: 'sparkasse',
    name: 'Sparkasse',
  },
  {
    value: 'n26',
    name: 'N26',
  },
  {
    value: 'volksbank',
    name: 'Volksbank',
  },
  {
    value: 'bar',
    name: 'Bar',
  },
  {
    value: 'depot',
    name: 'Depot',
  },
  {
    value: 'extern',
    name: 'Extern',
  },
];

@Component({
  selector: 'app-create-ausgabe',
  templateUrl: './create-ausgabe.component.html',
  styleUrls: ['./create-ausgabe.component.scss'],
})
export class CreateAusgabeComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateAusgabeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ausgabe,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.ausgabe = {
      faelligkeit: new Date(),
      art: '',
      sender: 'sparkasse',
      empfaenger: 'extern',
      kategorie: 'sparen',
      zyklus: 'm',
    };
  }

  faelligkeit = new FormControl(new Date());

  kategorien = KATEGORIEN;
  zyklen = ZYKLEN;
  sender = SENDER;
  empfaenger = EMPFAENGER;
  ausgabe!: Ausgabe;

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAusgabe(): Ausgabe {
    this.ausgabe.faelligkeit = this.faelligkeit.value;

    let totalMonatlich = 0;

    if (this.ausgabe.betrag) {
      if (this.ausgabe.zyklus === 'm') {
        totalMonatlich = totalMonatlich + +this.ausgabe.betrag;
      } else if (this.ausgabe.zyklus === 'q') {
        let q: number = +this.ausgabe.betrag / 3;
        totalMonatlich = totalMonatlich + +q;
      } else if (this.ausgabe.zyklus === 'j') {
        let j: number = +this.ausgabe.betrag / 12;
        totalMonatlich = totalMonatlich + +j;
      }
    }

    this.ausgabe.monatlich = totalMonatlich;
    this.ausgabe.quartalsweise = totalMonatlich * 3;
    this.ausgabe.jaehrlich = totalMonatlich * 12;

    return this.ausgabe;
  }
}
