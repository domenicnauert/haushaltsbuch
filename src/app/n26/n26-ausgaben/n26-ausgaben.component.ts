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
  selector: 'app-n26-ausgaben',
  templateUrl: './n26-ausgaben.component.html',
  styleUrls: ['./n26-ausgaben.component.scss'],
})
export class N26AusgabenComponent {
  public dataSource = new MatTableDataSource<Position>();
  public selection = new SelectionModel<Position>(true, []);
  public displayedColumns: string[] = [
    'checkbox',
    'faelligkeit',
    'art',
    'monatlich',
  ];

  @Output()
  changeAusgabe = new EventEmitter();
  @Output()
  changeDifferenz = new EventEmitter();

  constructor(private n26Service: N26Service) {
    this.n26Service.loadAllAusgeben().then(() => {
      this.dataSource = new MatTableDataSource(
        this.n26Service.ausgaben as Position[]
      );

      multisort(this.n26Service.ausgaben, ['faelligkeit', 'art', 'betrag']);

      this.n26Service.ausgaben.forEach((item) =>
        item.isChecked ? this.selection.select(item) : null
      );

      if (this.selection.selected.length > 0) {
        this.changeDiff(undefined);
      }

      this.getTotalCost();
    });
  }

  changeDiffAll() {
    this.changeDiff(undefined);
  }

  changeDiff(row: Position | undefined) {
    let totalMonatlich: number = 0;
    let ausgaben = this.dataSource.data;

    const calc = ausgaben.filter((item) =>
      this.selection.selected.includes(item)
    );
    calc.forEach((element) => {
      totalMonatlich = totalMonatlich + element.monatlich!;
    });
    if (row) {
      if (row && this.selection.selected.includes(row)) {
        row.isChecked = true;
      } else {
        row.isChecked = false;
      }
      this.n26Service.update(row);
    }

    this.changeDifferenz.emit(totalMonatlich);
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

    this.changeAusgabe.emit(total);

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
