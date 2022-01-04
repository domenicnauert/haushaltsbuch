import { LiveAnnouncer } from '@angular/cdk/a11y';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ausgabe } from '../model/ausgabe';
import { EnumMapper } from '../model/enumMapper';
import { Zyklus } from '../model/zyklus';
import { CreateAusgabeComponent } from './../create-ausgabe/create-ausgabe.component';
import { AusgabenService } from './../shared/ausgaben.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-ausgaben',
  templateUrl: './ausgaben.component.html',
  styleUrls: ['./ausgaben.component.scss'],
})
export class AusgabenComponent {
  public loading = true;
  public innerWidth: any;
  public totalBetrag = 0;
  public totalMonatlich = 0;
  public dataSource!: MatTableDataSource<Ausgabe>;
  public columns = [
    {
      column: 'Betrag',
      value: 'betrag',
      checked: true,
      pos: 3,
    },
    {
      column: 'Sender',
      value: 'sender',
      checked: true,
      pos: 4,
    },
    {
      column: 'Empfänger',
      value: 'empfaenger',
      checked: true,
      pos: 5,
    },
    {
      column: 'Kategorie',
      value: 'kategorie',
      checked: true,
      pos: 6,
    },
    {
      column: 'Zyklus',
      value: 'zyklus',
      checked: true,
      pos: 7,
    },
    {
      column: 'q',
      value: 'quartalsweise',
      checked: true,
      pos: 9,
    },
    {
      column: 'j',
      value: 'jaehrlich',
      checked: true,
      pos: 10,
    },
  ];
  public displayedColumns: string[] = [
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

  public EnumMapper = EnumMapper;
  public enumZyklus = Object.values(Zyklus);

  @Input()
  public title!: string;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private ausgabenService: AusgabenService
  ) {
    this.ausgabenService.loadAll().then(() => {
      this.loading = false;
      console.log('const');
      console.log(this.ausgabenService.ausgaben);
      this.dataSource = new MatTableDataSource(
        this.ausgabenService.ausgaben as Ausgabe[]
      );
      this.dataSource.sort = this.sort;
      this.getTotalCost();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.innerWidth = window.innerWidth;
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
        // nichts editiert
        return;
      } else if (result.isDelete) {
        // gelöschter Zugriff
        this.dataSource.data = this.dataSource.data.filter(
          (_, i) => i !== this.dataSource.data.indexOf(result)
        );
      } else {
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
        if (ausgabe.zyklus === Zyklus.M) {
          totalMonatlich = totalMonatlich + +ausgabe.betrag;
        } else if (ausgabe.zyklus === Zyklus.Q) {
          let q: number = +ausgabe.betrag / 3;
          totalMonatlich = totalMonatlich + +q;
        } else if (ausgabe.zyklus === Zyklus.J) {
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

  private get ausgaben(): Ausgabe[] {
    return this.ausgabenService.ausgaben as Ausgabe[];
  }

  tabelChange(item: string) {
    const index = this.displayedColumns.indexOf(item);

    if (index === -1) {
      // nicht im table => hinzufügen
      this.displayedColumns.splice(
        this.columns.findIndex((x) => x.value === item),
        0,
        item
      );
    } else {
      this.displayedColumns = this.displayedColumns.filter(
        (_, i) => i !== index
      );
    }
  }
}
