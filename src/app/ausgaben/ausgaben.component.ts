import { Ausgabe } from './../ausgabe';
import { CreateAusgabeComponent } from './../create-ausgabe/create-ausgabe.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { MatDialog } from '@angular/material/dialog';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

const ELEMENT_DATA: Ausgabe[] = [
  {
    id: 1,
    faelligkeit: new Date(),
    art: 'Netflix',
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
    art: 'Spotify',
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

@Component({
  selector: 'app-ausgaben',
  templateUrl: './ausgaben.component.html',
  styleUrls: ['./ausgaben.component.scss'],
})
export class AusgabenComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'faelligkeit',
    'art',
    'betrag',
    'sender',
    'empfaenger',
    'kategorie',
    'zyklus',
    'monatlich',
    'quartalsweise',
    'jaehrlich',
    'bearbeiten',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog) {
    this.getTotalCost();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  @ViewChild(MatSort)
  sort!: MatSort;

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  addAusgabe() {
    console.log('test');

    const neu: Ausgabe = {
      id: 1,
      faelligkeit: new Date(),
      art: 'Spotify',
      betrag: 200,
      sender: 'n26',
      empfaenger: 'extern',
      kategorie: 'abos',
      zyklus: 'm',
      monatlich: 200,
      quartalsweise: 800,
      jaehrlich: 2400,
    };
    this.dataSource.data = [...this.dataSource.data, neu];
  }

  save() {}

  totalBetrag = 0;
  totalMonatlich = 0;

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateAusgabeComponent, {
      width: '50%',
      //data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.dataSource.data = [
        ...this.dataSource.data,
        this.getAusgabeWithNextId(result),
      ];
      this.getTotalCost();
    });
  }

  private getAusgabeWithNextId(result: Ausgabe) {
    const id = Math.max(...this.dataSource.data.map((ausgabe) => ausgabe.id!));
    result.id = id + 1;
    return result;
  }

  getTotalCost() {
    let total: number = 0;
    let totalMonatlich = 0;

    this.dataSource.data.forEach((ausgabe) => {
      if (ausgabe.betrag) {
        total = total + +ausgabe.betrag;
        if (ausgabe.zyklus === 'm') {
          totalMonatlich = totalMonatlich + +ausgabe.betrag;
        } else if (ausgabe.zyklus === 'q') {
          let q: number = +ausgabe.betrag / 3;
          totalMonatlich = totalMonatlich + +q;
        } else if (ausgabe.zyklus === 'j') {
          let j: number = +ausgabe.betrag / 12;
          totalMonatlich = totalMonatlich + +j;
        } else {
        }
      }
    });

    this.totalBetrag = total;
    this.totalMonatlich = totalMonatlich;

    return total;
  }

  editAusgabe(ausgabe: Ausgabe) {
    const dialogRef = this.dialog.open(CreateAusgabeComponent, {
      width: '50%',
      data: ausgabe,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      this.dataSource.data.map((el) => {
        if (el.id == result.id) {
          return Object.assign({}, el, result);
        }
        return el;
      });

      this.getTotalCost();
    });
  }
}
