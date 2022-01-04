import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-einnahmen',
  templateUrl: './einnahmen.component.html',
  styleUrls: ['./einnahmen.component.scss'],
})
export class EinnahmenComponent implements OnInit {
  public einnahmenTitel = 'Einnahmenliste';

  constructor() {}

  ngOnInit(): void {}
}
