import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const apiUlr = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class EnvService {

  constructor(
    private http: HttpClient
  ) { }

  public getQuery<T>(query: string) {
    const HttpUploadOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' })
    };

    query = apiUlr + query;
    return this.http.get<T>(query, HttpUploadOptions).pipe(map((data: any) => data.data));
  }

  public postQuery<T>(query: string, form: any) {
    const HttpUploadOptions = {
      headers: new HttpHeaders({ 'Content-type': 'application/json' })
    };

    query = apiUlr + query;
    return this.http.post<T>(query, form, HttpUploadOptions).pipe(map((data: any) => data.data));
  }

  public postQueryImage<T>( query: string, form: any ) {

    // const headers = new HttpHeaders();
    // headers.append('Content-Type', 'multipart/form-data');
    // headers.append('Accept', 'application/json');

    query = apiUlr + query;
    return this.http.post<T>(query, form).pipe(map((data: any) => data.data));

  }

}
