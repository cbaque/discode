import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { Data } from '../interface/data';

@Injectable({
  providedIn: 'root'
})
export class ListasService {

  constructor(
    private envSer: EnvService
  ) { }

  public getData(codigo: string) {
    return this.envSer.getQuery<Data>(`/catalogo/listasgenerales/${codigo}`);
  }
}
