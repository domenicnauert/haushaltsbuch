import { Injectable } from '@angular/core';
import { Einnahme } from './../model/einnahme';
import { AusgabenService } from './ausgaben.service';
import { LoginService } from './login.service';

var queryBuilderAusgabenTable = Backendless.DataQueryBuilder.create().setWhereClause( "einnahmeBei is not null" );
queryBuilderAusgabenTable.setPageSize(100);

var queryBuilderEinnahmenTable = Backendless.DataQueryBuilder.create();
queryBuilderEinnahmenTable.setPageSize(100);


const AusgabenStore = Backendless.Data.of('Ausgabe');
const EinnahmenStore = Backendless.Data.of('Einnahme');

@Injectable({
  providedIn: 'root',
})
export class EinnahmenService {
  constructor(public loginService: LoginService, public ausgabenService : AusgabenService) {}

  public einnahmen: Einnahme[] = [];

  async loadAll() {
    if (!this.setCurrentUser()) {
      return;
    }
    this.einnahmen = [];

    await this.ausgabenService.

    return EinnahmenStore.find<Einnahme>(queryBuilderEinnahmenTable).then( (einnahmen:Einnahme[]) =>{
      console.log("einnahmen")
      console.log(einnahmen)
      for(let i = 0; i < einnahmen.length; i++){
        this.einnahmen.push(einnahmen[i])
      }
      console.log(this.einnahmen)
      this.einnahmen = this.einnahmen.sort((a, b) => a.id! - b.id!);
    })

     return AusgabenStore.find<Einnahme>(queryBuilderAusgabenTable).then(
      (einnahmen: Einnahme[]) => {
        console.log("ausgaben1")
      console.log(this.einnahmen)
        for(let i = 0; i < einnahmen.length; i++){
          this.einnahmen.push(einnahmen[i])
        }
        


        console.log("ausgaben2")
      console.log(this.einnahmen)
        this.einnahmen = this.einnahmen.sort((a, b) => a.id! - b.id!);
      }
    );
  }

  add(newEinnahme: Einnahme) {
    if (!this.setCurrentUser()) {
      return;
    }

    AusgabenStore.save(newEinnahme)
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

    AusgabenStore.remove(deleteEinnahme.objectId!).then(() => {
      this.einnahmen = this.einnahmen.filter(
        (_, i) => i !== this.einnahmen.indexOf(deleteEinnahme)
      );
    });

    return deleteEinnahme.id;
  }

  update(updateEinnahme: Einnahme) {
    this.setCurrentUser();

    AusgabenStore.save<Einnahme>(updateEinnahme).then(
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
