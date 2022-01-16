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
import { Position } from 'src/app/model/position';
import { Zyklus } from 'src/app/model/zyklus';
import { CreatePositionComponent } from 'src/app/position/create-position/create-position.component';
import { SparkontenService } from './../../shared/sparkonten.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
@Component({
  selector: 'app-kredite',
  templateUrl: './kredite.component.html',
  styleUrls: ['./kredite.component.scss'],
})
export class KrediteComponent {
  public innerWidth: any;
  public totalMonatlich = 0;
  public dataSource!: MatTableDataSource<Position>;
  public sortArray: string[] = [];
  public fallback = false;
  public kreditrate: Position = { monatlich: 0 } as Position;
  public currentAbzahlung: Position = {} as Position;

  public displayedColumns: string[] = ['faelligkeit', 'art', 'monatlich'];

  @Input()
  public title!: string;
  @Output()
  public update = new EventEmitter();

  constructor(
    public dialog: MatDialog,
    private sparkontenService: SparkontenService
  ) {
    this.sparkontenService.loadAllKredite().then(() => {
      multisort(this.sparkontenService.kredite, ['faelligkeit', 'monatlich']);
      this.dataSource = new MatTableDataSource(
        this.sparkontenService.kredite as Position[]
      );

      this.sparkontenService.loadAllKrediteAbzahlung().then(() => {
        multisort(this.sparkontenService.gehalt, ['faelligkeit', 'monatlich']);

        if (this.sparkontenService.kreditrate[0]) {
          this.kreditrate = this.sparkontenService.kreditrate[0];
        }

        this.getTotalCost();

        this.sparkontenService.loadAllAbzahlung().then(() => {
          multisort(this.sparkontenService.gehalt, [
            'faelligkeit',
            'monatlich',
          ]);
          this.currentAbzahlung = this.sparkontenService.abzahlung[0]!;

          this.calculateKredit();
        });
      });
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.innerWidth = window.innerWidth;
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
    this.totalMonatlich = totalMonatlich;

    return total;
  }

  calculateKredit() {
    if (this.currentAbzahlung && this.kreditrate) {
      const rateDate = new Date(this.kreditrate.faelligkeit!);
      const abzahlungDate = new Date(this.currentAbzahlung.faelligkeit!);

      if (abzahlungDate.getTime() < rateDate.getTime()) {
        const anzMonth = this.monthDiff(abzahlungDate, rateDate);

        this.currentAbzahlung.faelligkeit = this.kreditrate.faelligkeit;

        this.currentAbzahlung.betrag =
          this.currentAbzahlung.betrag! - this.kreditrate.betrag! * anzMonth;
        this.currentAbzahlung.monatlich =
          this.currentAbzahlung.monatlich! -
          this.kreditrate.monatlich! * anzMonth;

        this.currentAbzahlung.quartalsweise = this.currentAbzahlung.monatlich;
        this.currentAbzahlung.jaehrlich = this.currentAbzahlung.monatlich;

        this.sparkontenService.update(this.currentAbzahlung);
        this.dataSource.data = [...this.dataSource.data, this.currentAbzahlung];
        this.getTotalCost();
      } else if (this.currentAbzahlung) {
        this.dataSource.data = [...this.dataSource.data, this.currentAbzahlung];
      }
    }
  }

  monthDiff(d1: Date, d2: Date) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }
}
