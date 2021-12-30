import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Ausgabe } from '../ausgabe';
import { AusgabenComponent } from '../ausgaben/ausgaben.component';

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

  ausgabe!: Ausgabe;

  onNoClick(): void {
    this.dialogRef.close();
  }
}
