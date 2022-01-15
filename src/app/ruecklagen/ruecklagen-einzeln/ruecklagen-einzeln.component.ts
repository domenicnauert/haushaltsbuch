import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as multisort from 'multisort';
import { Zyklus } from 'src/app/model/zyklus';
import { EnumMapper } from '../../model/enumMapper';
import { Position } from '../../model/position';
import { RuecklagenService } from './../../shared/ruecklagen.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
@Component({
  selector: 'app-ruecklagen-einzeln',
  templateUrl: './ruecklagen-einzeln.component.html',
  styleUrls: ['./ruecklagen-einzeln.component.scss'],
})
export class RuecklagenEinzelnComponent implements OnInit {
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag = 0;
  public totalMonatlich = 0;
  public differenzTotal: number = 0;
  public enumZyklus = Object.values(Zyklus);
  public displayedColumns: string[] = [
    'faelligkeit',
    'art',
    'zyklus',
    'monatlich',
    'quartalsweise',
    'jaehrlich',
  ];
  dataSource = new MatTableDataSource<Position>();
  selection = new SelectionModel<Position>(true, []);
  anzEinnahmen = 0;
  inside = false;

  @Output()
  changeRuecklage = new EventEmitter();

  constructor(private ruecklagenService: RuecklagenService) {
    this.ruecklagenService.loadAllAusgeben().then(() => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(
        this.ruecklagenService.ausgaben as Position[]
      );

      this.anzEinnahmen = this.ruecklagenService.ausgaben.length;

      multisort(this.ruecklagenService.ausgaben, [
        'faelligkeit',
        'art',
        'betrag',
      ]);

      this.getTotalCost();
    });
  }

  ngOnInit(): void {}

  getTotalCost() {
    let total: number = 0;
    let totalMonatlich = 0;
    let position = this.dataSource.data;

    position.forEach((el) => {
      let position = el as Position;
      if (position.betrag) {
        if (position.zyklus === Zyklus.M) {
          totalMonatlich = totalMonatlich + +position.betrag;
          total = Math.ceil(total) + Math.ceil(position.betrag);
        } else if (position.zyklus === Zyklus.Q) {
          let q: number = +position.betrag / 3;
          totalMonatlich = totalMonatlich + +q;
          total = Math.ceil(total) + Math.ceil(q);
        } else if (position.zyklus === Zyklus.J) {
          let j: number = +position.betrag / 12;
          totalMonatlich = totalMonatlich + +j;
          total = Math.ceil(total) + Math.ceil(j);
        } else {
        }
      }
    });

    this.totalBetrag = total;
    this.totalMonatlich = totalMonatlich;

    this.changeRuecklage.emit(total);

    return total;
  }

  insertDifferenz() {
    this.dataSource.data = this.dataSource.data.filter(
      (a) => a.art != 'Erledigt'
    );
    if (this.differenzTotal == 0) {
      return;
    }
    const obj = {
      art: 'Erledigt',
      zyklus: 'M',
      monatlich: -this.differenzTotal,
    };
    this.dataSource.data = [...this.dataSource.data, obj];
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Position): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.id! + 1
    }`;
  }

  handleDifferenz(total: number) {
    this.differenzTotal = total;
    this.insertDifferenz();
  }
}
