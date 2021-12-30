import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Ausgabe } from '../ausgabe';
import { AusgabenComponent } from '../ausgaben/ausgaben.component';

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

@Component({
  selector: 'app-create-ausgabe',
  templateUrl: './create-ausgabe.component.html',
  styleUrls: ['./create-ausgabe.component.scss'],
})
export class CreateAusgabeComponent {
  constructor(
    public dialogRef: MatDialogRef<CreateAusgabeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Ausgabe
  ) {
    this.ausgabe = {
      faelligkeit: new Date(),
      art: '',
      sender: '',
      empfaenger: '',
      kategorie: '',
      zyklus: '',
    };
  }

  kategorien = KATEGORIEN;
  zyklen = ZYKLEN;
  ausgabe!: Ausgabe;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
