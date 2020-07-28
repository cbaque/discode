import { Injectable } from '@angular/core';
import { EnvService } from '../../Services/env.service';
import { environment } from 'src/environments/environment';
import { Data } from '../../interface/data';
import { HttpRequest, HttpClient } from '@angular/common/http';

const apiUlr = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private envSer: EnvService,
    private http: HttpClient
  ) { }

  public sendLogin(data: any) {
    return this.envSer.postQuery<Data>(`/auth/login`, data);
  }

}
