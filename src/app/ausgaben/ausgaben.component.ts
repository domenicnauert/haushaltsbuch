import { LiveAnnouncer } from '@angular/cdk/a11y';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ausgabe } from '../shared/ausgabe';
import { CreateAusgabeComponent } from './../create-ausgabe/create-ausgabe.component';
import { AusgabenService } from './../shared/ausgaben.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-ausgaben',
  templateUrl: './ausgaben.component.html',
  styleUrls: ['./ausgaben.component.scss'],
})
export class AusgabenComponent implements OnInit {
  loading = true;
  innerWidth: any;
  totalBetrag = 0;
  totalMonatlich = 0;
  dataSource!: MatTableDataSource<Ausgabe>;
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

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private ausgabenService: AusgabenService
  ) {
    this.ausgabenService.loadAllRest().then(() => {
      this.dataSource = new MatTableDataSource(
        this.ausgabenService.ausgaben as Ausgabe[]
      );
      this.getTotalCost();
    });
  }

  ngOnInit() {
    this.ausgabenService.loadAllRest();
    this.innerWidth = window.innerWidth;
    setTimeout(() => {
      this.dataSource.data = this.ausgabenService.ausgaben;
      this.dataSource.sort = this.sort;
      this.getTotalCost();
    }, 1000);
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
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

  createAusgabe(): void {
    let width = '50%';
    if (this.innerWidth < 1300) {
      width = '100%';
    }
    const dialogRef = this.dialog.open(CreateAusgabeComponent, {
      width: width,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      let ausgabeWithId = this.getAusgabeWithNextId(result);
      this.ausgabenService.add(ausgabeWithId);

      this.dataSource.data = [...this.dataSource.data, ausgabeWithId];
      this.getTotalCost();
    });
  }

  private getAusgabeWithNextId(result: Ausgabe) {
    const id = Math.max(
      ...this.dataSource.data.map((ausgabe) => (ausgabe as Ausgabe).id!)
    );
    if (id === -Infinity) {
      result.id = 1;
    } else {
      result.id = id + 1;
    }
    return result;
  }

  editAusgabe(ausgabe: Ausgabe) {
    const dialogRef = this.dialog.open(CreateAusgabeComponent, {
      width: '50%',
      data: ausgabe,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        console.log('nichts');
        // nichts editiert
        return;
      } else if (result.isDelete) {
        // gelöschter Zugriff
        console.log('löschen');
        this.dataSource.data = this.dataSource.data.filter(
          (_, i) => i !== this.dataSource.data.indexOf(result)
        );
      } else {
        console.log('edit');
        this.dataSource.data.map((ausgabe) => {
          let el = ausgabe as Ausgabe;
          if (el.id == result.id) {
            return Object.assign({}, el, result);
          }
          return el;
        });
      }

      this.getTotalCost();
    });
  }

  getTotalCost() {
    let total: number = 0;
    let totalMonatlich = 0;
    let ausgaben = this.dataSource.data;

    ausgaben.forEach((el) => {
      let ausgabe = el as Ausgabe;
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

  get ausgaben(): Ausgabe[] {
    return this.ausgabenService.ausgaben as Ausgabe[];
  }

  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }
}
