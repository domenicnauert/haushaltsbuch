import { Component } from '@angular/core';
// var multisort = require('multisort');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public ausgabenTitel = 'Ausgabenliste';
  public einnahmenTitel = 'Einnahmenliste';
  public positionenTitel = 'Positionenliste';
  private key: string = 'HaushaltsbuchV1.Tab';
  public selected = 0;
  public updated = 0;
  public updatedRuecklagen = 0;

  constructor() {
    const tab = localStorage.getItem(this.key);

    if (tab) {
      this.selected = tab as unknown as number;
    }
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

  handleRuecklagenUpdated() {
    this.updatedRuecklagen = 1;
  }
}
