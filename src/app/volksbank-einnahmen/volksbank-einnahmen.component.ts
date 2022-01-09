
import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EnumMapper } from '../model/enumMapper';
import { PositionService } from '../shared/position.service';
import { Position } from '../model/position';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);

const ELEMENT_DATA: Position[] = [
  {
    id: 1,
    art: 'Hydrogen',
    betrag: 1.0079,
    zyklus: 'H',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 2,
    art: 'Helium',
    betrag: 4.0026,
    zyklus: 'He',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 3,
    art: 'Lithium',
    betrag: 6.941,
    zyklus: 'Li',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 4,
    art: 'Beryllium',
    betrag: 9.0122,
    zyklus: 'Be',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 5,
    art: 'Boron',
    betrag: 10.811,
    zyklus: 'B',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 6,
    art: 'Carbon',
    betrag: 12.0107,
    zyklus: 'C',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 7,
    art: 'Nitrogen',
    betrag: 14.0067,
    zyklus: 'N',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 8,
    art: 'Oxygen',
    betrag: 15.9994,
    zyklus: 'O',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 9,
    art: 'Fluorine',
    betrag: 18.9984,
    zyklus: 'F',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
  {
    id: 10,
    art: 'Neon',
    betrag: 20.1797,
    zyklus: 'Ne',
    monatlich: 1.0079,
    faelligkeit: new Date(),
  },
];

@Component({
  selector: 'app-volksbank-einnahmen',
  templateUrl: './volksbank-einnahmen.component.html',
  styleUrls: ['./volksbank-einnahmen.component.scss'],
})
export class VolksbankEinnahmenComponent implements OnInit {

  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public displayedColumns: string[] = [
    'checkbox',
    'id',
    'faelligkeit',
    'art',
    'monatlich',
  ];
  dataSource = new MatTableDataSource<Position>(ELEMENT_DATA);
  selection = new SelectionModel<Position>(true, []);

  constructor(
    
    private positionService: PositionService
  ) {
    this.positionService.loadAllEinnahmen().then(() => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(
        this.positionService.einnahmen as Position[]
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
