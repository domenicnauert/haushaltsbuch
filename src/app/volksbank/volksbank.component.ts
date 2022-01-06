import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EnumMapper } from '../model/enumMapper';
import { Position } from '../model/position';
import { PositionService } from '../shared/position.service';

@Component({
  selector: 'app-volksbank',
  templateUrl: './volksbank.component.html',
  styleUrls: ['./volksbank.component.scss'],
})
export class VolksbankComponent implements OnInit {
  public dataSource!: MatTableDataSource<Position>;
  public EnumMapper = EnumMapper;
  public loading: boolean = false;
  public totalBetrag: number = 0;
  public displayedColumns: string[] = ['id', 'faelligkeit', 'art', 'monatlich'];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private ausgabenService: PositionService
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
