import { Injectable } from '@angular/core';
import { EnvService } from './env.service';
import { Data } from '../interface/data';
import { environment } from 'src/environments/environment';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const apiUlr = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(
    private envSer: EnvService,
    private http: HttpClient
  ) { }

  public setProducto(data: any) {
    return this.envSer.postQuery<Data>(`/producto/create`, data);
  }

  public editProducto(data: any) {
    return this.envSer.postQuery<Data>(`/producto/edit`, data);
  }

  // public setProductoImage(data: any) {
  //   return this.envSer.postQueryImage<Data>(`/producto/create`, data);
  // }

  public getProducts() {
    return this.envSer.getQuery<Data>(`/producto/lista`);
  }

  public getProductossCliente() {
    return this.envSer.getQuery<Data>(`/home/productos`);
  }

  public getProductosImages( producto: Number ) {
    return this.envSer.getQuery<Data>(`/home/productos/images/${ producto }`);
  }

}
