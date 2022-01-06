import { LiveAnnouncer } from '@angular/cdk/a11y';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CreateAusgabeComponent } from '../create-ausgabe/create-ausgabe.component';
import { EnumMapper } from '../model/enumMapper';
import { Position } from './../model/position';
import { Zyklus } from './../model/zyklus';
import { PositionService } from './../shared/position.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
@Component({
  selector: 'app-einnahmen',
  templateUrl: './einnahmen.component.html',
  styleUrls: ['./einnahmen.component.scss'],
})
export class EinnahmenComponent {
  public loading = true;
  public innerWidth: any;
  public totalBetrag = 0;
  public totalMonatlich = 0;
  public dataSource!: MatTableDataSource<Position>;
  public sizeColumnsInit!: number;
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
    private positionenServcie: PositionService
  ) {
    this.sizeColumnsInit = this.displayedColumns.length;

    this.positionenServcie.loadAllEinnahmen().then(() => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(
        this.positionenServcie.einnahmen as Position[]
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
      data: {
        isAusgabe: false,
        isEdit: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      let einnahmeWithId = this.getEinnahmeWithNextId(result);
      this.positionenServcie.add(einnahmeWithId);

      this.dataSource.data = [...this.dataSource.data, einnahmeWithId];
      this.getTotalCost();
    });
  }

  private getEinnahmeWithNextId(result: Position) {
    const id = Math.max(
      ...this.dataSource.data.map((einnahme) => (einnahme as Position).id!)
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
      data: {
        pos: ausgabe,
        isAusgabe: false,
        isEdit: true,
      },
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
        this.dataSource.data.map((einnahme) => {
          let el = einnahme as Position;
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
    let einnahmen = this.dataSource.data;

    einnahmen.forEach((el) => {
      let einnahme = el as Position;
      if (einnahme.betrag) {
        total = total + +einnahme.betrag;
        if (einnahme.zyklus === Zyklus.M) {
          totalMonatlich = totalMonatlich + +einnahme.betrag;
        } else if (einnahme.zyklus === Zyklus.Q) {
          let q: number = +einnahme.betrag / 3;
          totalMonatlich = totalMonatlich + +q;
        } else if (einnahme.zyklus === Zyklus.J) {
          let j: number = +einnahme.betrag / 12;
          totalMonatlich = totalMonatlich + +j;
        } else {
        }
      }
    });

    this.totalBetrag = total;
    this.totalMonatlich = totalMonatlich;

    return total;
  }

  private get einnahmen(): Position[] {
    return this.positionenServcie.einnahmen as Position[];
  }
}
