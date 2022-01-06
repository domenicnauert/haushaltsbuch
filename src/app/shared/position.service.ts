import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Position } from '../model/position';
import { LoginService } from './login.service';

const PositionStore = Backendless.Data.of('Position');

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(public loginService: LoginService) {}

  public positionen: Position[] = [];
  public ausgaben: Position[] = [];
  public einnahmen: Position[] = [];

  async loadAll() {
    if (!this.setCurrentUser()) {
      return;
    }

    var queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (positionen: Position[]) => {
        positionen = positionen.sort((a, b) => a.id! - b.id!);
        this.positionen = positionen;
      }
    );
  }

  async loadAllAusgeben() {
    if (!this.setCurrentUser()) {
      return;
    }

    var queryBuilder =
      Backendless.DataQueryBuilder.create().setWhereClause('isAusgabe = true');
    queryBuilder.setPageSize(100);

    return PositionStore.find<Position>(queryBuilder).then(
      (positionen: Position[]) => {
        positionen = positionen.sort((a, b) => a.id! - b.id!);
        this.ausgaben = positionen;
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

  add(newPosition: Position) {
    if (!this.setCurrentUser()) {
      return;
    }

    PositionStore.save(newPosition)
      .then((savedPosition) => {
        this.positionen.push(savedPosition);
      })
      .catch(function (error) {
        console.log('an error has occurred ' + error.message);
      });
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
