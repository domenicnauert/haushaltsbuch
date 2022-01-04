import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empfaenger } from '../model/empfaenger';
import { EnumMapper } from '../model/enumMapper';
import { Kategorie } from '../model/kategorie';
import { Sender } from '../model/sender';
import { Zyklus } from '../model/zyklus';
import { EinnahmenService } from '../shared/einnahmen.service';
import { Einnahme } from './../model/einnahme';

@Component({
  selector: 'app-create-einnahme',
  templateUrl: './create-einnahme.component.html',
  styleUrls: ['./create-einnahme.component.scss'],
})
export class CreateEinnahmeComponent {
  public einnahme!: Einnahme;
  public flgShowDelete: boolean = false;
  public faelligkeit = new FormControl(new Date());

  public EnumMapper = EnumMapper;
  public enumKategorie = Object.values(Kategorie);
  public enumSender = Object.values(Sender);
  public enumEmpfaenger = Object.values(Empfaenger);
  public enumZyklus = Object.values(Zyklus);

  constructor(
    public dialogRef: MatDialogRef<CreateEinnahmeComponent>,
    private einnahmenService: EinnahmenService,
    @Inject(MAT_DIALOG_DATA) public data: Einnahme
  ) {
    this.initEinnahme();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAusgabe(): Einnahme {
    this.einnahme.faelligkeit = this.faelligkeit.value;

    let totalMonatlich = 0;

    if (this.einnahme.betrag) {
      if (this.einnahme.zyklus === Zyklus.M) {
        totalMonatlich = totalMonatlich + +this.einnahme.betrag;
      } else if (this.einnahme.zyklus === Zyklus.Q) {
        let q: number = +this.einnahme.betrag / 3;
        totalMonatlich = totalMonatlich + +q;
      } else if (this.einnahme.zyklus === Zyklus.J) {
        let j: number = +this.einnahme.betrag / 12;
        totalMonatlich = totalMonatlich + +j;
      }
    }

    this.einnahme.monatlich = totalMonatlich;
    this.einnahme.quartalsweise = totalMonatlich * 3;
    this.einnahme.jaehrlich = totalMonatlich * 12;

    return this.einnahme;
  }

  private initEinnahme() {
    if (this.data) {
      this.flgShowDelete = true;
      this.faelligkeit.setValue(new Date(this.data.faelligkeit));
      this.einnahme = this.data;
    } else {
      this.flgShowDelete = false;
      this.einnahme = {
        faelligkeit: new Date(),
        art: '',
        sender: Sender.SPARKASSE,
        empfaenger: Empfaenger.EXTERN,
        kategorie: Kategorie.SPAREN,
        zyklus: Zyklus.M,
      };
    }
  }

  onDeleteClick() {
    this.einnahme.isDelete = true;
    return this.einnahmenService.delete(this.einnahme);
  }
  onChangeClick() {
    this.einnahme.isChange = true;
    return this.einnahmenService.update(this.einnahme);
  }
}
