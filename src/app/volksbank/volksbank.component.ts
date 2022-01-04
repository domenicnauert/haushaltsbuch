import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Ausgabe } from '../shared/ausgabe';
import { AusgabenService } from '../shared/ausgaben.service';
import { EnumMapper } from '../shared/enumMapper';

@Component({
  selector: 'app-volksbank',
  templateUrl: './volksbank.component.html',
  styleUrls: ['./volksbank.component.scss'],
})
export class VolksbankComponent implements OnInit {
  public dataSource!: MatTableDataSource<Ausgabe>;
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public displayedColumns: string[] = ['id', 'faelligkeit', 'art', 'monatlich'];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private ausgabenService: AusgabenService
  ) {}

  ngOnInit(): void {}

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  getTotalCost() {
    console.log();
  }
}
