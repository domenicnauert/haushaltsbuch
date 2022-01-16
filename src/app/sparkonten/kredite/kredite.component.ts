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
  public kreditAbzahlung = 0;

  public displayedColumns: string[] = [
    'faelligkeit',
    'art',
    'monatlich',
    'bearbeiten',
  ];

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
        this.kreditAbzahlung =
          this.sparkontenService.krediteAbzahlung[0].monatlich!;
        this.getTotalCost();
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

  getTooltip() {
    const text =
      'Die Sparquote sollte 20 % betragen inkl. Altersvorsorge. Das entspricht bei deinem Gehalt von ' +
      this.kreditAbzahlung +
      ' ca. ' +
      Math.ceil(0.2 * this.kreditAbzahlung) +
      ' €.';
    if (this.kreditAbzahlung == 0) {
      return 'Lege bei den Positionen einen Position mit der Kategorie "Gehalt" fest.';
    }
    if (this.totalMonatlich == 0) {
      return 'Lege bei den Positionen einen Position mit der Kategorie "Sparen" fest.';
    }
    return text;
  }
}
