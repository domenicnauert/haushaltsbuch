export interface Ausgabe {
  objectId?: string;
  id?: number;
  faelligkeit: Date;
  art: string;
  betrag?: number;
  sender: string;
  empfaenger: string;
  kategorie: string;
  zyklus: string;
  monatlich?: number;
  quartalsweise?: number;
  jaehrlich?: number;
  isDelete?: boolean;
  isChange?: boolean;
}
