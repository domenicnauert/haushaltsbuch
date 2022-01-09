import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnumMapper } from '../model/enumMapper';
import { Position } from './../model/position';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-volksbank-differenz',
  templateUrl: './volksbank-differenz.component.html',
  styleUrls: ['./volksbank-differenz.component.scss'],
})
export class VolksbankDifferenzComponent implements OnChanges {
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public displayedColumns: string[] = [
    // 'checkbox',
    // 'id',
    'faelligkeit',
    'art',
    'monatlich',
  ];
  dataSource = new MatTableDataSource<Position>();
  selection = new SelectionModel<Position>(true, []);

  constructor() {
    this.dataSource = new MatTableDataSource([
      this.einnahmenGesamt,
      this.ausgabenGesamt,
    ] as Position[]);
  }

  @Input()
  einnahmenGesamt: any;
  @Input()
  ausgabenGesamt: any;

  ngOnChanges(changes: SimpleChanges): void {
    const data = [
      this.einnahmenGesamt as Position,
      this.ausgabenGesamt as Position,
    ];
    this.dataSource = new MatTableDataSource(data as Position[]);
  }

  getTotalCost() {
    let total: number = 0;
    let positionen = this.dataSource.data;

    total = positionen[0].monatlich! - positionen[1].monatlich!;

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
}
