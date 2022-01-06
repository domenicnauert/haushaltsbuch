export interface Position {
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
  einnahmeBei?: string;
  ownerId?: string;
  isDelete?: boolean;
  isChange?: boolean;
  isAusgabe?: boolean;
}
