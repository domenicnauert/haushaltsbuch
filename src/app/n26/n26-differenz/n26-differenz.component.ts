import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Position } from '../../model/position';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-n26-differenz',
  templateUrl: './n26-differenz.component.html',
  styleUrls: ['./n26-differenz.component.scss'],
})
export class N26DifferenzComponent implements OnChanges {
  public displayedColumns: string[] = ['faelligkeit', 'art', 'monatlich'];
  public dataSource = new MatTableDataSource<Position>();
  public selection = new SelectionModel<Position>(true, []);

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
