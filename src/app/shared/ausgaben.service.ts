import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Ausgabe } from './ausgabe';
import { LoginService } from './login.service';

var queryBuilder = Backendless.DataQueryBuilder.create();
queryBuilder.setPageSize(100);

const AusgabenStore = Backendless.Data.of('Ausgabe');

@Injectable({
  providedIn: 'root',
})
export class AusgabenService {
  constructor(public loginService: LoginService) {}

  public ausgaben: Ausgabe[] = [];

  async loadAll() {
    this.setCurrentUser();

    return AusgabenStore.find<Ausgabe>(queryBuilder).then(
      (ausgaben: Ausgabe[]) => {
        ausgaben = ausgaben.sort((a, b) => a.id! - b.id!);
        this.ausgaben = ausgaben;
      }
    );
  }

  add(newAusgabe: Ausgabe) {
    this.setCurrentUser();

    AusgabenStore.save(newAusgabe)
      .then((savedAusgabe) => {
        console.log('new Contact instance has been saved');
        console.log(savedAusgabe);
        this.ausgaben.push(savedAusgabe);
      })
      .catch(function (error) {
        console.log('an error has occurred ' + error.message);
      });
  }

  delete(deleteAusgabe: Ausgabe) {
    this.setCurrentUser();

    AusgabenStore.remove(deleteAusgabe.objectId!).then(() => {
      this.ausgaben = this.ausgaben.filter(
        (_, i) => i !== this.ausgaben.indexOf(deleteAusgabe)
      );
    });

    return deleteAusgabe.id;
  }

  update(updateAusgabe: Ausgabe) {
    this.setCurrentUser();

    AusgabenStore.save<Ausgabe>(updateAusgabe).then(
      (updatedAusgabe: Ausgabe) => {
        this.ausgaben.map((ausgabe) => {
          let el = ausgabe as Ausgabe;
          if (el.id == updateAusgabe.id) {
            return Object.assign({}, el, updateAusgabe);
          }
          return el;
        });
      }
    );
  }

  private setCurrentUser() {
    Backendless.UserService.currentUser = { ___class: 'Users' };
    (Backendless.UserService.currentUser as any)['user-token'] =
      localStorage.getItem('token');
  }
}
