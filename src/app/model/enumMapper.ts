import { Empfaenger } from './empfaenger';
import { Kategorie } from './kategorie';
import { Sender } from './sender';
import { Zyklus } from './zyklus';

export const EnumMapper: Record<any, string> = {
  [Kategorie.LEER]: '--',
  [Kategorie.ABO]: 'Abo',
  [Kategorie.FIXKOSTEN]: 'Fixkosten',
  [Kategorie.KONSUM]: 'Konsum',
  [Kategorie.KREDIT]: 'Kredit',
  [Kategorie.SPAREN]: 'Sparen',
  [Kategorie.VERSICHERUNG]: 'Versicherung',
  [Kategorie.VERTRAG]: 'Vertrag',

  [Sender.LEER]: '--',
  [Sender.VOLKSBANK]: 'Volksbank',
  [Sender.SPARKASSE]: 'Sparkasse',
  [Sender.N26]: 'N26',

  [Empfaenger.LEER]: '--',
  [Empfaenger.VOLKSBANK]: 'Volksbank',
  [Empfaenger.SPARKASSE]: 'Sparkasse',
  [Empfaenger.N26]: 'N26',
  [Empfaenger.EXTERN]: 'Extern',
  [Empfaenger.BAR]: 'Bar',
  [Empfaenger.DEPOT]: 'Depot',

  [Zyklus.Q]: 'q',
  [Zyklus.M]: 'm',
  [Zyklus.J]: 'j',
};
