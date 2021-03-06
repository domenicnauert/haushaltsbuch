import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Position } from 'src/app/model/position';
import { VolksbankService } from 'src/app/shared/volksbank.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-volksbank-ausgaben',
  templateUrl: './volksbank-ausgaben.component.html',
  styleUrls: ['./volksbank-ausgaben.component.scss'],
})
export class VolksbankAusgabenComponent {
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

  constructor(private positionenService: VolksbankService) {
    this.positionenService.loadAllAusgeben().then(() => {
      this.dataSource = new MatTableDataSource(
        this.positionenService.ausgaben as Position[]
      );

      this.positionenService.ausgaben.forEach((item) =>
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
      this.positionenService.update(row);
    }

    // this.changeDifferenz.emit(total);
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
