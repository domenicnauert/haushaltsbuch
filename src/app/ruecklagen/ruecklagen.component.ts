import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { RuecklagenGesamtComponent } from './ruecklagen-gesamt/ruecklagen-gesamt.component';

registerLocaleData(localeDe, 'de-DE', localeDeExtra);
@Component({
  selector: 'app-ruecklagen',
  templateUrl: './ruecklagen.component.html',
  styleUrls: ['./ruecklagen.component.scss'],
})
export class RuecklagenComponent {
  @ViewChild(RuecklagenGesamtComponent)
  rucklagenComponent!: RuecklagenGesamtComponent;

  @Output()
  ruecklagenUpdated = new EventEmitter();

  handleRuecklageChanged(total: number) {
    this.rucklagenComponent.handleRuecklageChanged(total);
  }

  handleRuecklagenUpdated() {
    this.ruecklagenUpdated.emit();
  }
}
