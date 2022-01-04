export interface Einnahme {
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
  ownerId?: string;
  isDelete?: boolean;
  isChange?: boolean;
}
