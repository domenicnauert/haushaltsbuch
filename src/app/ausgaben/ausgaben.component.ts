import { Ausgabe } from './../ausgabe';
import { CreateAusgabeComponent } from './../create-ausgabe/create-ausgabe.component';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

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
    zyklus: 'M',
    monatlich: 100,
    quartalsweise: 400,
    jaehrlich: 1200,
  },
  {
    id: 2,
    faelligkeit: new Date(),
    art: 'Spotify',
    betrag: 200,
    sender: 'N26',
    empfaenger: 'Extern',
    kategorie: 'Abos',
    zyklus: 'M',
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
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
  ) {}

  @ViewChild(MatSort)
  sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getTotalCost() {
    return this.dataSource.data
      .map((t) => t.betrag)
      .reduce((acc, value) => acc! + value!, 0);
  }

  addAusgabe() {
    console.log('test');

    const neu: Ausgabe = {
      id: 1,
      faelligkeit: new Date(),
      art: 'Spotify',
      betrag: 200,
      sender: 'N26',
      empfaenger: 'Extern',
      kategorie: 'Abos',
      zyklus: 'M',
      monatlich: 200,
      quartalsweise: 800,
      jaehrlich: 2400,
    };
    this.dataSource.data = [...this.dataSource.data, neu];
  }

  save() {}

  animal: string | undefined;
  name: string | undefined;

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateAusgabeComponent, {
      width: '50%',
      data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.animal = result;
      console.log(this.animal);
    });
  }
}
