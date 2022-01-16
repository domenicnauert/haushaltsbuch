import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Empfaenger } from './../model/empfaenger';
import { Kategorie } from './../model/kategorie';
import { Position } from './../model/position';
import { LoginService } from './login.service';

const PositionStore = Backendless.Data.of('Position');

@Injectable({
  providedIn: 'root',
})
export class SparkontenService {
  constructor(public loginService: LoginService) {}

  public positionen: Position[] = [];
  public einnahmen: Position[] = [];
  public gehalt: Position[] = [];
  public kredite: Position[] = [];
  public krediteAbzahlung: Position[] = [];

  async loadAllSparen() {
    if (!this.setCurrentUser()) {
      return;
    }

    const where = "kategorie = '" + Kategorie.SPAREN + "'";

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause(where);
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (positionen: Position[]) => {
        this.positionen = positionen;
      }
    );
  }

  async loadAllKredite() {
    if (!this.setCurrentUser()) {
      return;
    }

    const where =
      "empfaenger = '" +
      Empfaenger.KREDITE +
      "' AND " +
      "kategorie = '" +
      Kategorie.KONTOSTAND +
      "'";

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause(where);
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (kredite: Position[]) => {
        this.kredite = kredite;
      }
    );
  }

  async loadAllKrediteAbzahlung() {
    if (!this.setCurrentUser()) {
      return;
    }

    const where =
      "empfaenger = '" +
      Empfaenger.KREDITE +
      "' AND " +
      "kategorie = '" +
      Kategorie.KREDIT +
      "'";

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause(where);
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (krediteAbzahlung: Position[]) => {
        this.krediteAbzahlung = krediteAbzahlung;
      }
    );
  }

  async loadGehalt() {
    if (!this.setCurrentUser()) {
      return;
    }

    const where = "kategorie = '" + Kategorie.GEHALT + "'";

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause(where);
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (positionen: Position[]) => {
        this.gehalt = positionen;
      }
    );
  }

  async loadAllEinnahmen() {
    if (!this.setCurrentUser()) {
      return;
    }

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause('isAusgabe = false');
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (positionen: Position[]) => {
        positionen = positionen.sort((a, b) => a.id! - b.id!);
        this.einnahmen = positionen;
      }
    );
  }

  delete(deletePosition: Position) {
    if (!this.setCurrentUser()) {
      return;
    }

    PositionStore.remove(deletePosition.objectId!).then(() => {
      this.positionen = this.positionen.filter(
        (_, i) => i !== this.positionen.indexOf(deletePosition)
      );
    });

    return deletePosition.id;
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
