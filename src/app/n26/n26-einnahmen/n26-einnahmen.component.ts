import { SelectionModel } from '@angular/cdk/collections';
import { formatNumber, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EBADF } from 'constants';
import * as multisort from 'multisort';
import { EnumMapper } from '../../model/enumMapper';
import { Position } from '../../model/position';
import { N26Service } from '../../shared/n26.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-n26-einnahmen',
  templateUrl: './n26-einnahmen.component.html',
  styleUrls: ['./n26-einnahmen.component.scss'],
})
export class N26EinnahmenComponent implements OnInit {
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public displayedColumns: string[] = [
    //'checkbox',
    // 'id',
    'faelligkeit',
    'art',
    'monatlich',
  ];
  dataSource = new MatTableDataSource<Position>();
  selection = new SelectionModel<Position>(true, []);
  value: any;

  @Output()
  changeEinnahmen = new EventEmitter();

  constructor(private n26Service: N26Service) {
    this.n26Service.loadAllEinnahmen().then(() => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(
        this.n26Service.einnahmen as Position[]
      );

      multisort(this.n26Service.einnahmen, ['faelligkeit', 'art', 'betrag']);

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

  handleEinnahmeChanged(el : Position) {
    el.betrag = el.monatlich
    el.quartalsweise = el.monatlich!*3;
    el.jaehrlich = el.monatlich!*12

    this.n26Service.update(el);
  }

   
}
