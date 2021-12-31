import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ausgabe } from '../shared/ausgabe';
import { AusgabenService } from './../shared/ausgaben.service';

const KATEGORIEN = [
  {
    value: undefined,
    name: '--',
  },
  {
    value: 'Abos',
    name: 'Abos',
  },
  {
    value: 'Fixkosten',
    name: 'Fixkosten',
  },
  {
    value: 'Konsum',
    name: 'Konsum',
  },
  {
    value: 'Krdite',
    name: 'Krdite',
  },
  {
    value: 'Sparen',
    name: 'Sparen',
  },
  {
    value: 'Versicherung',
    name: 'Versicherung',
  },
  {
    value: 'Verträge',
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
    value: 'Sparkasse',
    name: 'Sparkasse',
  },
  {
    value: 'N26',
    name: 'N26',
  },
  {
    value: 'Volksbank',
    name: 'Volksbank',
  },
];

const EMPFAENGER = [
  {
    value: undefined,
    name: '--',
  },
  {
    value: 'Sparkasse',
    name: 'Sparkasse',
  },
  {
    value: 'N26',
    name: 'N26',
  },
  {
    value: 'Volksbank',
    name: 'Volksbank',
  },
  {
    value: 'Bar',
    name: 'Bar',
  },
  {
    value: 'Depot',
    name: 'Depot',
  },
  {
    value: 'Extern',
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
    private ausgabenService: AusgabenService
  ) {
    this.initAusgabe();
  }

  faelligkeit = new FormControl(new Date());

  kategorien = KATEGORIEN;
  zyklen = ZYKLEN;
  sender = SENDER;
  empfaenger = EMPFAENGER;
  ausgabe!: Ausgabe;
  flgShowDelete: boolean = false;

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAusgabe(isChange: boolean): Ausgabe {
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

  initAusgabe() {
    if (this.data) {
      this.flgShowDelete = true;
      this.faelligkeit.setValue(new Date(this.data.faelligkeit));
      this.ausgabe = this.data;
    } else {
      this.flgShowDelete = false;
      this.ausgabe = {
        faelligkeit: new Date(),
        art: '',
        sender: 'Sparkasse',
        empfaenger: 'Extern',
        kategorie: 'Sparen',
        zyklus: 'm',
      };
    }
  }

  onDeleteClick() {
    this.ausgabe.isDelete = true;
    return this.ausgabenService.delete(this.ausgabe);
  }
  onChangeClick() {
    this.ausgabe.isChange = true;
    return this.ausgabenService.update(this.ausgabe);
  }
}
