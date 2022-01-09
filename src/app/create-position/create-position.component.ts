import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumMapper } from '../model/enumMapper';
import { Position } from '../model/position';
import { Zyklus } from '../model/zyklus';
import { PositionService } from '../shared/position.service';
import { Empfaenger } from './../model/empfaenger';
import { Kategorie } from './../model/kategorie';
import { Sender } from './../model/sender';

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
  public isKontostand!: boolean;
  public isTemporaer!: boolean;
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
    this.initPosition();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getPosition(): Position {
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

  private initPosition() {
    if (this.positionenInput) {
      this.flgShowDelete = true;
      this.faelligkeit.setValue(new Date(this.positionenInput.faelligkeit));
      this.position = this.positionenInput;
      this.isAusgabe = this.positionenInput.isAusgabe;
      this.isKontostand = this.positionenInput.isKontostand;
      this.isTemporaer = this.positionenInput.isTemporaer;
    } else {
      this.flgShowDelete = false;
      this.faelligkeit.setValue(new Date());
      this.position = {
        faelligkeit: new Date(),
        art: '',
        sender: Sender.SPARKASSE,
        empfaenger: Empfaenger.EXTERN,
        kategorie: Kategorie.SPAREN,
        zyklus: Zyklus.M,
        isAusgabe: this.isAusgabe,
        isKontostand: this.isKontostand,
        isTemporaer: this.isTemporaer,
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

  flgAusgabeChanged() {
    this.position.isAusgabe = !this.position.isAusgabe;

    this.isKontostand = false;
    this.isTemporaer = false;

    this.flgKontostandChanged();
  }

  flgKontostandChanged() {
    if (this.isKontostand) {
      this.position.isKontostand = !this.position.isKontostand;
      this.position.sender = Sender.LEER;
      this.position.kategorie = Kategorie.KONTOSTAND;
      this.faelligkeit.setValue(new Date('2022-01-01T00:00:00'));
    } else {
      console.log('init');
      this.initPosition();
    }
  }

  flgTemporaerChanged() {
    this.position.isTemporaer = !this.position.isTemporaer;
  }
}
