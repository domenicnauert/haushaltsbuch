import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnumMapper } from '../model/enumMapper';
import { Position } from '../model/position';
import { N26Service } from '../shared/n26.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

@Component({
  selector: 'app-sparkasse-ausgaben',
  templateUrl: './sparkasse-ausgaben.component.html',
  styleUrls: ['./sparkasse-ausgaben.component.scss'],
})
export class SparkasseAusgabenComponent implements OnInit {
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public displayedColumns: string[] = [
    'checkbox',
    // 'id',
    'faelligkeit',
    'art',
    'monatlich',
  ];
  dataSource = new MatTableDataSource<Position>();
  selection = new SelectionModel<Position>(true, []);

  @Output()
  changeAusgabe = new EventEmitter();

  constructor(private n26Service: N26Service) {
    this.n26Service.loadAllAusgeben().then(() => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(
        this.n26Service.ausgaben as Position[]
      );

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

  handleTableChange(row: any) {
    // console.log(row);
    // console.log(this.selection.selected);
  }
}