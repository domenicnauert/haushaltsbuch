import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  public ausgabenTitel = 'Ausgabenliste';
  public einnahmenTitel = 'Einnahmenliste';
  private key: string = 'HaushaltsbuchV1.Tab';
  public selected = 0;

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
}
