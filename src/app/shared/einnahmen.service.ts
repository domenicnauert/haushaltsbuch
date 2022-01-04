import { Injectable } from '@angular/core';
import { Einnahme } from './../model/einnahme';
import { LoginService } from './login.service';

var queryBuilder = Backendless.DataQueryBuilder.create();
queryBuilder.setPageSize(100);

const EinnahmenStore = Backendless.Data.of('Einnahme');

@Injectable({
  providedIn: 'root',
})
export class EinnahmenService {
  constructor(public loginService: LoginService) {}

  public einnahmen: Einnahme[] = [];

  async loadAll() {
    if (!this.setCurrentUser()) {
      return;
    }

    return EinnahmenStore.find<Einnahme>(queryBuilder).then(
      (einnahmen: Einnahme[]) => {
        einnahmen = einnahmen.sort((a, b) => a.id! - b.id!);
        this.einnahmen = einnahmen;
      }
    );
  }

  add(newEinnahme: Einnahme) {
    if (!this.setCurrentUser()) {
      return;
    }

    EinnahmenStore.save(newEinnahme)
      .then((savedEinnahme) => {
        this.einnahmen.push(savedEinnahme);
      })
      .catch(function (error) {
        console.log('an error has occurred ' + error.message);
      });
  }

  delete(deleteEinnahme: Einnahme) {
    if (!this.setCurrentUser()) {
      return;
    }

    EinnahmenStore.remove(deleteEinnahme.objectId!).then(() => {
      this.einnahmen = this.einnahmen.filter(
        (_, i) => i !== this.einnahmen.indexOf(deleteEinnahme)
      );
    });

    return deleteEinnahme.id;
  }

  update(updateEinnahme: Einnahme) {
    this.setCurrentUser();

    EinnahmenStore.save<Einnahme>(updateEinnahme).then(
      (updatedEinnahme: Einnahme) => {
        this.einnahmen.map((einnahmen) => {
          let el = einnahmen as Einnahme;
          if (el.id == updateEinnahme.id) {
            return Object.assign({}, el, updateEinnahme);
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
