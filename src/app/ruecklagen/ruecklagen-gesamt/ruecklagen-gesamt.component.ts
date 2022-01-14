import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as multisort from 'multisort';
import { EnumMapper } from '../../model/enumMapper';
import { Position } from '../../model/position';
import { RuecklagenService } from './../../shared/ruecklagen.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
@Component({
  selector: 'app-ruecklagen-gesamt',
  templateUrl: './ruecklagen-gesamt.component.html',
  styleUrls: ['./ruecklagen-gesamt.component.scss'],
})
export class RuecklagenGesamtComponent implements OnInit {
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public differenzTotal: number = 0;
  public displayedColumns: string[] = [
    //'checkbox',
    // 'id',
    'faelligkeit',
    'art',
    'monatlich',
  ];
  dataSource = new MatTableDataSource<Position>();
  selection = new SelectionModel<Position>(true, []);
  anzEinnahmen = 0;
  inside = false;

  @Output()
  changeEinnahmen = new EventEmitter();

  constructor(private ruecklagenService: RuecklagenService) {
    this.ruecklagenService.loadAllEinnahmen().then(() => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(
        this.ruecklagenService.einnahmen as Position[]
      );

      this.anzEinnahmen = this.ruecklagenService.einnahmen.length;

      multisort(this.ruecklagenService.einnahmen, [
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
    let einnahmen = this.dataSource.data;

    const calc = einnahmen.filter(
      (item) => !this.selection.selected.includes(item)
    );
    calc.forEach((el) => {
      total = total + el.monatlich!;
    });

    this.changeEinnahmen.emit(total);

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
