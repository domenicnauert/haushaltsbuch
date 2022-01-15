import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as multisort from 'multisort';
import { Position } from '../../model/position';
import { SparkasseService } from '../../shared/sparkasse.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-sparkasse-einnahmen',
  templateUrl: './sparkasse-einnahmen.component.html',
  styleUrls: ['./sparkasse-einnahmen.component.scss'],
})
export class SparkasseEinnahmenComponent {
  public differenzTotal: number = 0;
  public dataSource = new MatTableDataSource<Position>();
  public selection = new SelectionModel<Position>(true, []);
  public displayedColumns: string[] = ['faelligkeit', 'art', 'monatlich'];

  @Output()
  changeEinnahmen = new EventEmitter();

  constructor(private sparkasseService: SparkasseService) {
    this.sparkasseService.loadAllEinnahmen().then(() => {
      this.dataSource = new MatTableDataSource(
        this.sparkasseService.einnahmen as Position[]
      );

      multisort(this.sparkasseService.einnahmen, [
        'faelligkeit',
        'art',
        'betrag',
      ]);

      this.getTotalCost();

      if (this.differenzTotal > 0) {
        this.insertDifferenz();
      }
    });
  }

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

  handleDifferenz(total: number) {
    this.differenzTotal = total;
    this.insertDifferenz();
  }
}
