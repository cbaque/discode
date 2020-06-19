import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpRequest, HttpHandler,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class Server implements HttpInterceptor {
    token: string;
    // token_type: string;

    constructor(
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // if (data) {
        //     this.token = data;
        //     // this.token_type = data.token_type;
        // }

        this.token = localStorage.getItem('token');

        if (this.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer' + ' ' + this.token
                }
            });
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({
                setHeaders: {
                    'content-type': 'application/json'
                }
            });
        }

        return next.handle(request).pipe(

            // retry(1),
            catchError((error: HttpErrorResponse) => {
                // this.mensajeSrv.mensajeAlerta( error.error.message, false );
                return throwError(error);
            })
        );



    }

}
