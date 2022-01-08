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
  selector: 'app-create-position',
  templateUrl: './create-position.component.html',
  styleUrls: ['./create-position.component.scss'],
})
export class CreatePositionComponent {
  public positionenInput: any | undefined;
  public position!: Position;
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
    public dialogRef: MatDialogRef<CreatePositionComponent>,
    private ausgabenService: PositionService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.positionenInput = data.pos;
    this.isEdit = data.isEdit;

    this.isAusgabe = data.isAusgabe;
    this.initAusgabe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAusgabe(): Position {
    this.position.faelligkeit = this.faelligkeit.value;

    let totalMonatlich = 0;

    if (this.position.betrag) {
      if (this.position.zyklus === Zyklus.M) {
        totalMonatlich = totalMonatlich + +this.position.betrag;
      } else if (this.position.zyklus === Zyklus.Q) {
        let q: number = +this.position.betrag / 3;
        totalMonatlich = totalMonatlich + +q;
      } else if (this.position.zyklus === Zyklus.J) {
        let j: number = +this.position.betrag / 12;
        totalMonatlich = totalMonatlich + +j;
      }
    }

    this.position.monatlich = totalMonatlich;
    this.position.quartalsweise = totalMonatlich * 3;
    this.position.jaehrlich = totalMonatlich * 12;

    return this.position;
  }

  private initAusgabe() {
    if (this.positionenInput) {
      this.flgShowDelete = true;
      this.faelligkeit.setValue(new Date(this.positionenInput.faelligkeit));
      this.position = this.positionenInput;
      this.isAusgabe = this.positionenInput.isAusgabe;
    } else {
      this.flgShowDelete = false;
      this.position = {
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
    this.position.isDelete = true;
    return this.ausgabenService.delete(this.position);
  }

  onChangeClick() {
    this.position.isChange = true;
    return this.ausgabenService.update(this.position);
  }

  flgChanged() {
    this.position.isAusgabe = !this.position.isAusgabe;
  }
}
