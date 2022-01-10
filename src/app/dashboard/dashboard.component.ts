import { Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { AusgabenComponent } from './../ausgaben/ausgaben.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnChanges {
  public ausgabenTitel = 'Ausgabenliste';
  public einnahmenTitel = 'Einnahmenliste';
  private key: string = 'HaushaltsbuchV1.Tab';
  public selected = 0;
  public updated = 0;

  @ViewChild(AusgabenComponent)
  ausgabenComponent!: AusgabenComponent;

  constructor() {
    const tab = localStorage.getItem(this.key);

    if (tab) {
      this.selected = tab as unknown as number;
    }
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
}
