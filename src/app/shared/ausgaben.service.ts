import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Backendless from 'backendless';
import { Ausgabe } from './ausgabe';
import { LoginService } from './login.service';

var queryBuilder = Backendless.DataQueryBuilder.create();
queryBuilder.setPageSize(100);

const AusgabenStore = Backendless.Data.of('Ausgabe');

const url =
  'https://api.backendless.com/8643CCDF-E094-60FE-FF6C-7B28D45AD200/DA4B4851-EB9E-42FD-AB62-216AE67B3C88/data/Ausgabe';

const ELEMENT_DATA: Ausgabe[] = [
  {
    id: 1,
    faelligkeit: new Date(),
    art: 'hahah',
    betrag: 100,
    sender: 'N26',
    empfaenger: 'Extern',
    kategorie: 'Abos',
    zyklus: 'm',
    monatlich: 100,
    quartalsweise: 400,
    jaehrlich: 1200,
  },
  {
    id: 4,
    faelligkeit: new Date(),
    art: 'heheh',
    betrag: 200,
    sender: 'N26',
    empfaenger: 'Extern',
    kategorie: 'Abos',
    zyklus: 'm',
    monatlich: 200,
    quartalsweise: 800,
    jaehrlich: 2400,
  },
];

@Injectable({
  providedIn: 'root',
})
export class AusgabenService {
  constructor(public loginService: LoginService, private http: HttpClient) {}

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

  async loadAllRest() {
    const options = {
      headers: new HttpHeaders().set('user-token', this.getCookie('token')),
    };

    const x = this.http
      .get<any>(url, options)
      .subscribe((ausgaben: Ausgabe[]) => {
        ausgaben = ausgaben.sort((a, b) => a.id! - b.id!);
        this.ausgaben = ausgaben;
        return ausgaben;
      });
    return x;
  }

  add2(newAusgabe: Ausgabe) {
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

  async add(newAusgabe: Ausgabe) {
    const savedAusgabe = await AusgabenStore.save<Ausgabe>(newAusgabe);
    this.ausgaben.push(savedAusgabe);
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

    return AusgabenStore.save<Ausgabe>(updateAusgabe).then(
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

  private getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }
}
