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
  selector: 'app-sparkasse-ausgaben',
  templateUrl: './sparkasse-ausgaben.component.html',
  styleUrls: ['./sparkasse-ausgaben.component.scss'],
})
export class SparkasseAusgabenComponent {
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

  constructor(private sparkasseService: SparkasseService) {
    this.sparkasseService.loadAllAusgeben().then(() => {
      this.dataSource = new MatTableDataSource(
        this.sparkasseService.ausgaben as Position[]
      );

      multisort(this.sparkasseService.ausgaben, [
        'faelligkeit',
        'art',
        'betrag',
      ]);
      this.sparkasseService.ausgaben.forEach((item) =>
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
    let total: number = 0;
    let ausgaben = this.dataSource.data;

    const calc = ausgaben.filter((item) =>
      this.selection.selected.includes(item)
    );
    calc.forEach((el) => {
      total = total + el.monatlich!;
    });
    if (row) {
      if (row && this.selection.selected.includes(row)) {
        row.isChecked = true;
      } else {
        row.isChecked = false;
      }
      this.sparkasseService.update(row);
    }
    this.changeDifferenz.emit(total);
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
