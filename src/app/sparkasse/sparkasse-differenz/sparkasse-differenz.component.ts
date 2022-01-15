import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, Input, OnChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnumMapper } from '../../model/enumMapper';
import { Position } from '../../model/position';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-sparkasse-differenz',
  templateUrl: './sparkasse-differenz.component.html',
  styleUrls: ['./sparkasse-differenz.component.scss'],
})
export class SparkasseDifferenzComponent implements OnChanges {
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public dataSource = new MatTableDataSource<Position>();
  public selection = new SelectionModel<Position>(true, []);
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
