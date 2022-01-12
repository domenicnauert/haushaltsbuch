import { LiveAnnouncer } from '@angular/cdk/a11y';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as multisort from 'multisort';
import { CreatePositionComponent } from '../create-position/create-position.component';
import { EnumMapper } from '../model/enumMapper';
import { Zyklus } from '../model/zyklus';
import { PositionService } from '../shared/position.service';
import { Position } from './../model/position';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent {
  public loading = true;
  public innerWidth: any;
  public totalBetrag = 0;
  public totalMonatlich = 0;
  public dataSource!: MatTableDataSource<Position>;
  public sortArray: string[] = [];
  public fallback = false;
  public columns = [
    {
      column: 'Ausgabe?',
      value: 'isAusgabe',
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
    'isAusgabe',
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

  @Output()
  public update = new EventEmitter();

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private positionenService: PositionService
  ) {
    this.positionenService.updateAllToNextMonth().then(() => {
      let toUpdate = this.positionenService.toUpdate;
      const anz = this.updateMonth(toUpdate);
      if (anz > 0) {
        this.update.emit(anz);
      }
    });

    this.positionenService.loadAll().then(() => {
      this.loading = false;

      multisort(this.positionenService.positionen, [
        'id',
        'faelligkeit',
        'betrag',
      ]);
      this.dataSource = new MatTableDataSource(
        this.positionenService.positionen as Position[]
      );
      this.dataSource.sort = this.sort;
      this.getTotalCost();
    });
  }

  updateMonth(toUpdate: Position[]) {
    const date = new Date();

    toUpdate = toUpdate.filter(
      (a, i) => new Date(a.faelligkeit!).getTime() < date.getTime()
    );
    const updated: number = toUpdate.length;

    if (toUpdate.length > 0) {
      for (let i = 0; i < toUpdate.length; i++) {
        const newDate = new Date(toUpdate[i].faelligkeit!).setMonth(
          new Date(toUpdate[i].faelligkeit!).getMonth() + 1
        );
        toUpdate[i].faelligkeit = new Date(newDate);
      }

      this.positionenService.update(toUpdate[0]);
    }
    return updated;
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
    const dialogRef = this.dialog.open(CreatePositionComponent, {
      width: width,
      data: { isAusgabe: true, isEdit: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      let ausgabeWithId = this.getPositionWithNextId(result);
      this.positionenService.add(ausgabeWithId);

      this.dataSource.data = [...this.dataSource.data, ausgabeWithId];
      this.getTotalCost();
    });
  }

  private getPositionWithNextId(result: Position) {
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

  editPosition(position: Position) {
    const dialogRef = this.dialog.open(CreatePositionComponent, {
      width: '50%',
      data: { pos: position, isAusgabe: true, isEdit: true },
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
        this.dataSource.data.map((position) => {
          let el = position as Position;
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
    let position = this.dataSource.data;

    position.forEach((el) => {
      let position = el as Position;
      if (position.betrag) {
        total = total + +position.betrag;
        if (position.zyklus === Zyklus.M) {
          totalMonatlich = totalMonatlich + +position.betrag;
        } else if (position.zyklus === Zyklus.Q) {
          let q: number = +position.betrag / 3;
          totalMonatlich = totalMonatlich + +q;
        } else if (position.zyklus === Zyklus.J) {
          let j: number = +position.betrag / 12;
          totalMonatlich = totalMonatlich + +j;
        } else {
        }
      }
    });

    this.totalBetrag = total;
    this.totalMonatlich = totalMonatlich;

    return total;
  }

  handleSort(c: string) {
    const desc = '~' + c;

    if (
      this.fallback &&
      this.sortArray.length == 1 &&
      this.sortArray.includes('id')
    ) {
      this.sortArray = this.sortArray.filter((a, i) => a != 'id');
      this.fallback = false;
    }
    if (this.sortArray.includes(c)) {
      this.sortArray[this.sortArray.indexOf(c)] = desc;
    } else if (this.sortArray.includes(desc)) {
      this.sortArray = this.sortArray.filter((a, i) => a != desc);
    } else {
      this.sortArray.push(c);
    }

    if (this.sortArray.length == 0) {
      this.fallback = true;
      this.sortArray.push('id');
    }

    const sorted = multisort(this.positionenService.positionen, this.sortArray);
    this.dataSource.data = sorted;
  }
}
