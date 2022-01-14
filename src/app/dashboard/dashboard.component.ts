import { Component, OnChanges, SimpleChanges } from '@angular/core';
import * as multisort from 'multisort';
// var multisort = require('multisort');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnChanges {
  public ausgabenTitel = 'Ausgabenliste';
  public einnahmenTitel = 'Einnahmenliste';
  public positionenTitel = 'Positionenliste';
  private key: string = 'HaushaltsbuchV1.Tab';
  public selected = 0;
  public updated = 0;

  constructor() {
    const tab = localStorage.getItem(this.key);

    if (tab) {
      this.selected = tab as unknown as number;
    }
    this.sort();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  selectedTabChanged(event: number) {
    localStorage.setItem(this.key, event.toString());
    this.selected = event;
  }

  handleDBUpdate(event: number) {
    this.updated = event;
  }

  reload() {
    window.location.reload();
  }

  test = [
    { id: 1, name: 'aaa', desc: 'zzz' },
    { id: 2, name: 'bbb', desc: 'zzz' },
    { id: 3, name: 'bbb', desc: 'xxx' },
    { id: 4, name: 'bbb', desc: 'aaa' },
  ];

  sort() {
    var criteria = ['desc', 'name'];

    multisort(this.test, criteria);
  }
}
