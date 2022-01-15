import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as multisort from 'multisort';
import { Position } from '../../model/position';
import { N26Service } from '../../shared/n26.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-n26-einnahmen',
  templateUrl: './n26-einnahmen.component.html',
  styleUrls: ['./n26-einnahmen.component.scss'],
})
export class N26EinnahmenComponent {
  public differenzTotal: number = 0;
  public displayedColumns: string[] = ['faelligkeit', 'art', 'monatlich'];
  public dataSource = new MatTableDataSource<Position>();
  public selection = new SelectionModel<Position>(true, []);

  @Output()
  changeEinnahmen = new EventEmitter();

  constructor(private n26Service: N26Service) {
    this.n26Service.loadAllEinnahmen().then(() => {
      this.dataSource = new MatTableDataSource(
        this.n26Service.einnahmen as Position[]
      );

      multisort(this.n26Service.einnahmen, ['faelligkeit', 'art', 'betrag']);

      this.getTotalCost();

      if (this.differenzTotal > 0) {
        this.insertDifferenz();
      }
    });
  }

  getTotalCost() {
    let summeMonatlich: number = 0;
    let einnahmen = this.dataSource.data;

    const calc = einnahmen.filter(
      (item) => !this.selection.selected.includes(item)
    );
    calc.forEach((element) => {
      summeMonatlich = summeMonatlich + element.monatlich!;
    });

    this.changeEinnahmen.emit(summeMonatlich);

    return summeMonatlich;
  }

  insertDifferenz() {
    this.dataSource.data = this.dataSource.data.filter(
      (item) => item.art != 'Erledigt'
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

  handleEinnahmeChanged(item: Position) {
    item.betrag = item.monatlich;
    item.quartalsweise = item.monatlich! * 3;
    item.jaehrlich = item.monatlich! * 12;

    this.n26Service.update(item);
  }

  handleDifferenz(total: number) {
    this.differenzTotal = total;
    this.insertDifferenz();
  }
}
