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
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as multisort from 'multisort';
import { EnumMapper } from '../model/enumMapper';
import { Sender } from '../model/sender';
import { Zyklus } from '../model/zyklus';
import { PositionService } from '../shared/position.service';
import { Empfaenger } from './../model/empfaenger';
import { Kategorie } from './../model/kategorie';
import { Position } from './../model/position';
import { CreatePositionComponent } from './create-position/create-position.component';

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
  public EnumMapper = EnumMapper;
  public enumZyklus = Object.values(Zyklus);
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
      const toUpdateAnzahl = this.updateMonth(toUpdate);
      if (toUpdateAnzahl > 0) {
        this.update.emit(toUpdateAnzahl);
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

      this.getTotalCost();
    });
  }

  updateMonth(toUpdate: Position[]) {
    const currentDate = new Date();

    toUpdate = toUpdate.filter(
      (a, i) => new Date(a.faelligkeit!).getTime() < currentDate.getTime()
    );
    const updated: number = toUpdate.length;

    if (toUpdate.length > 0) {
      for (let i = 0; i < toUpdate.length; i++) {
        const newDate = new Date(toUpdate[i].faelligkeit!).setMonth(
          new Date(toUpdate[i].faelligkeit!).getMonth() + 1
        );
        toUpdate[i].faelligkeit = new Date(newDate);
        this.positionenService.update(toUpdate[i]);
      }
    }
    return updated;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.innerWidth = window.innerWidth;
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

      let positionWithId = this.getPositionWithNextId(result);
      if (
        positionWithId.kategorie == Kategorie.KREDIT &&
        positionWithId.empfaenger == Empfaenger.KREDITE
      ) {
        this.positionenService.loadAllAbzahlung().then(() => {
          if (this.positionenService.abzahlung.length == 0) {
            console.log('lege an ');
            const abgezahlt = {
              faelligkeit: positionWithId.faelligkeit,
              art: 'abgezahlt',
              betrag: 0,
              monatlich: 0,
              quartalsweise: 0,
              jaehrlich: 0,
              sender: Sender.LEER,
              empfaenger: Empfaenger.LEER,
              kategorie: Kategorie.KREDIT,
              zyklus: Zyklus.M,
              isAusgabe: true,
              isKontostand: false,
              isTemporaer: true,
            };
            this.positionenService.add(this.getPositionWithNextId(abgezahlt));
            this.dataSource.data = [...this.dataSource.data, abgezahlt];
          } else {
            console.log('exists');
          }
        });
      }
      this.positionenService.add(positionWithId);

      this.dataSource.data = [...this.dataSource.data, positionWithId];
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
