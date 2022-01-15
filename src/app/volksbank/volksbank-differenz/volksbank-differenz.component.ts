import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Position } from '../../model/position';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-volksbank-differenz',
  templateUrl: './volksbank-differenz.component.html',
  styleUrls: ['./volksbank-differenz.component.scss'],
})
export class VolksbankDifferenzComponent implements OnChanges {
  dataSource = new MatTableDataSource<Position>();
  selection = new SelectionModel<Position>(true, []);
  public displayedColumns: string[] = ['faelligkeit', 'art', 'monatlich'];

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

  ngOnChanges(): void {
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
}
