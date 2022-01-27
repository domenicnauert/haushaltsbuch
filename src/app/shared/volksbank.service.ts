import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Position } from '../model/position';
import { Empfaenger } from './../model/empfaenger';
import { Sender } from './../model/sender';
import { LoginService } from './login.service';

const PositionStore = Backendless.Data.of('Position');

@Injectable({
  providedIn: 'root',
})
export class VolksbankService {
  constructor(public loginService: LoginService) {}

  public positionen: Position[] = [];
  public ausgaben: Position[] = [];
  public einnahmen: Position[] = [];

  async loadAllAusgeben() {
    if (!this.setCurrentUser()) {
      return;
    }
    const where =
      "sender = '" +
      Sender.VOLKSBANK +
      "' OR (empfaenger = '" +
      Empfaenger.VOLKSBANK +
      "' AND isTemporaer = true)";

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause(where);
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (positionen: Position[]) => {
        positionen = positionen.sort(
          (a, b) =>
            new Date(a.faelligkeit!).getTime() -
            new Date(b.faelligkeit!).getTime()
        );
        this.ausgaben = positionen;
      }
    );
  }

  async loadAllEinnahmen() {
    if (!this.setCurrentUser()) {
      return;
    }

    const where = "empfaenger = '" + Empfaenger.VOLKSBANK + "' ";

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause(where);
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (positionen: Position[]) => {
        positionen = positionen.sort(
          (a, b) =>
            new Date(a.faelligkeit!).getTime() -
            new Date(b.faelligkeit!).getTime()
        );
        this.einnahmen = positionen;
      }
    );
  }

  update(updatePosition: Position) {
    this.setCurrentUser();

    PositionStore.save<Position>(updatePosition).then(
      (updatedPosition: Position) => {
        this.positionen.map((position) => {
          let el = position as Position;
          if (el.id == updatePosition.id) {
            return Object.assign({}, el, updatePosition);
          }
          return el;
        });
      }
    );
  }

  private setCurrentUser() {
    let token = localStorage.getItem('token');
    if (token && token !== '') {
      Backendless.UserService.currentUser = { ___class: 'Users' };
      (Backendless.UserService.currentUser as any)['user-token'] = token;

      return true;
    }
    return false;
  }
}
