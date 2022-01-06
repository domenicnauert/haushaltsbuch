import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Empfaenger } from '../model/empfaenger';
import { EnumMapper } from '../model/enumMapper';
import { Kategorie } from '../model/kategorie';
import { Position } from '../model/position';
import { Sender } from '../model/sender';
import { Zyklus } from '../model/zyklus';
import { PositionService } from '../shared/position.service';

@Component({
  selector: 'app-create-ausgabe',
  templateUrl: './create-ausgabe.component.html',
  styleUrls: ['./create-ausgabe.component.scss'],
})
export class CreateAusgabeComponent {
  public position: any | undefined;
  public ausgabe!: Position;
  public isAusgabe!: boolean;
  public isEdit!: boolean;
  public flgShowDelete: boolean = false;
  public faelligkeit = new FormControl(new Date());

  public EnumMapper = EnumMapper;
  public enumKategorie = Object.values(Kategorie);
  public enumSender = Object.values(Sender);
  public enumEmpfaenger = Object.values(Empfaenger);
  public enumZyklus = Object.values(Zyklus);

  constructor(
    public dialogRef: MatDialogRef<CreateAusgabeComponent>,
    private ausgabenService: PositionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.position = data.pos;
    this.isEdit = data.isEdit;

    this.isAusgabe = data.isAusgabe;
    this.initAusgabe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAusgabe(): Position {
    this.ausgabe.faelligkeit = this.faelligkeit.value;

    let totalMonatlich = 0;

    if (this.ausgabe.betrag) {
      if (this.ausgabe.zyklus === Zyklus.M) {
        totalMonatlich = totalMonatlich + +this.ausgabe.betrag;
      } else if (this.ausgabe.zyklus === Zyklus.Q) {
        let q: number = +this.ausgabe.betrag / 3;
        totalMonatlich = totalMonatlich + +q;
      } else if (this.ausgabe.zyklus === Zyklus.J) {
        let j: number = +this.ausgabe.betrag / 12;
        totalMonatlich = totalMonatlich + +j;
      }
    }

    this.ausgabe.monatlich = totalMonatlich;
    this.ausgabe.quartalsweise = totalMonatlich * 3;
    this.ausgabe.jaehrlich = totalMonatlich * 12;

    return this.ausgabe;
  }

  private initAusgabe() {
    if (this.position) {
      this.flgShowDelete = true;
      this.faelligkeit.setValue(new Date(this.position.faelligkeit));
      this.ausgabe = this.position;

      console.log(this.position);
      this.isAusgabe = this.position.isAusgabe;
    } else {
      this.flgShowDelete = false;
      this.ausgabe = {
        faelligkeit: new Date(),
        art: '',
        sender: Sender.SPARKASSE,
        empfaenger: Empfaenger.EXTERN,
        kategorie: Kategorie.SPAREN,
        zyklus: Zyklus.M,
        isAusgabe: this.isAusgabe,
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

  flgChanged() {
    this.ausgabe.isAusgabe = !this.ausgabe.isAusgabe;
  }
}
