import { SelectionModel } from '@angular/cdk/collections';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as multisort from 'multisort';
import { EnumMapper } from '../../model/enumMapper';
import { Position } from '../../model/position';
import { RuecklagenService } from './../../shared/ruecklagen.service';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
@Component({
  selector: 'app-ruecklagen-gesamt',
  templateUrl: './ruecklagen-gesamt.component.html',
  styleUrls: ['./ruecklagen-gesamt.component.scss'],
})
export class RuecklagenGesamtComponent implements OnInit {
  public EnumMapper = EnumMapper;
  public totalBetrag: number = 0;
  public displayedColumns: string[] = [
    //'checkbox',
    // 'id',
    'faelligkeit',
    'art',
    'monatlich',
  ];
  dataSource = new MatTableDataSource<Position>();
  selection = new SelectionModel<Position>(true, []);
  anzEinnahmen = 0;
  inside = false;

  @Output()
  changedRuecklagen = new EventEmitter();

  constructor(private ruecklagenService: RuecklagenService) {
    this.ruecklagenService.loadAllEinnahmen().then(() => {
      this.dataSource = new MatTableDataSource(
        this.ruecklagenService.einnahmen as Position[]
      );

      this.anzEinnahmen = this.ruecklagenService.einnahmen.length;

      multisort(this.ruecklagenService.einnahmen, [
        'faelligkeit',
        'art',
        'betrag',
      ]);

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

  handleRuecklageChanged(total: number) {
    if (
      total &&
      this.dataSource.data[0] &&
      total != this.dataSource.data[0].monatlich
    ) {
      this.dataSource.data[0].monatlich = total;
      this.dataSource.data[0].betrag = total;
      this.dataSource.data[0].quartalsweise = total * 3;
      this.dataSource.data[0].jaehrlich = total * 12;

      this.ruecklagenService.update(this.dataSource.data[0]);
      this.changedRuecklagen.emit();
    }
  }
}
