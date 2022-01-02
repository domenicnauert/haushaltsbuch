import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ausgabe } from '../shared/ausgabe';
import { Kategorie } from '../shared/kategorie';
import { AusgabenService } from './../shared/ausgaben.service';
import { Empfaenger } from './../shared/empfaenger';
import { EnumMapper } from './../shared/enumMapper';
import { Sender } from './../shared/sender';
import { Zyklus } from './../shared/zyklus';

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
    value: 'Kredit',
    name: 'Kredit',
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
  public kategorien = KATEGORIEN;
  public zyklen = ZYKLEN;
  public sender = SENDER;
  public empfaenger = EMPFAENGER;
  public ausgabe!: Ausgabe;
  public flgShowDelete: boolean = false;
  public faelligkeit = new FormControl(new Date());

  public EnumMapper = EnumMapper;
  public enumKategorie = Object.values(Kategorie);
  public enumSender = Object.values(Sender);
  public enumEmpfaenger = Object.values(Empfaenger);
  public enumZyklus = Object.values(Zyklus);

  constructor(
    public dialogRef: MatDialogRef<CreateAusgabeComponent>,
    private ausgabenService: AusgabenService,
    @Inject(MAT_DIALOG_DATA) public data: Ausgabe
  ) {
    this.initAusgabe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAusgabe(): Ausgabe {
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
    if (this.data) {
      this.flgShowDelete = true;
      this.faelligkeit.setValue(new Date(this.data.faelligkeit));
      this.ausgabe = this.data;
    } else {
      this.flgShowDelete = false;
      this.ausgabe = {
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
    this.ausgabe.isDelete = true;
    return this.ausgabenService.delete(this.ausgabe);
  }
  onChangeClick() {
    this.ausgabe.isChange = true;
    return this.ausgabenService.update(this.ausgabe);
  }
}
