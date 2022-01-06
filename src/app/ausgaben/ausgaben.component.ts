import { LiveAnnouncer } from '@angular/cdk/a11y';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnumMapper } from '../model/enumMapper';
import { Position } from '../model/position';
import { Zyklus } from '../model/zyklus';
import { PositionService } from '../shared/position.service';
import { CreateAusgabeComponent } from './../create-ausgabe/create-ausgabe.component';

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
  public dataSource!: MatTableDataSource<Position>;
  public columns = [
    {
      column: 'Betrag',
      value: 'betrag',
      checked: true,
    },
    {
      column: 'Sender',
      value: 'sender',
      checked: true,
    },
    {
      column: 'Empfänger',
      value: 'empfaenger',
      checked: true,
    },
    {
      column: 'Kategorie',
      value: 'kategorie',
      checked: true,
    },
    {
      column: 'Zyklus',
      value: 'zyklus',
      checked: true,
    },
    {
      column: 'q',
      value: 'quartalsweise',
      checked: true,
    },
    {
      column: 'j',
      value: 'jaehrlich',
      checked: true,
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
    private positionenService: PositionService
  ) {
    this.positionenService.loadAllAusgeben().then(() => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(
        this.positionenService.ausgaben as Position[]
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
      data: { isAusgabe: true, isEdit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      let ausgabeWithId = this.getAusgabeWithNextId(result);
      this.positionenService.add(ausgabeWithId);

      this.dataSource.data = [...this.dataSource.data, ausgabeWithId];
      this.getTotalCost();
    });
  }

  private getAusgabeWithNextId(result: Position) {
    const id = Math.max(
      ...this.dataSource.data.map((ausgabe) => (ausgabe as Position).id!)
    );
    if (id === -Infinity) {
      result.id = 1;
    } else {
      result.id = id + 1;
    }
    return result;
  }

  editAusgabe(ausgabe: Position) {
    const dialogRef = this.dialog.open(CreateAusgabeComponent, {
      width: '50%',
      data: { pos: ausgabe, isAusgabe: true, isEdit: true },
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
          let el = ausgabe as Position;
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
      let ausgabe = el as Position;
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

  private get ausgaben(): Position[] {
    return this.positionenService.ausgaben as Position[];
  }
}
