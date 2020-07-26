import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder,FormArray, Validators } from '@angular/forms';
import { LoginService } from 'src/app/Global/CommonSignIn/login.service';
import { finalize } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'embryo-SignIn',
  templateUrl: './CommonSignIn.component.html',
  styleUrls: ['./CommonSignIn.component.scss']
})
export class CommonSignInComponent implements OnInit {

  loginForm   : FormGroup;

  constructor(private formGroup : FormBuilder,
              private loginSrv: LoginService,
              public router: Router) { }

  ngOnInit() {
    this.loginForm = this.formGroup.group({
      username         : ['', [Validators.required]],
      password          : ['', [Validators.required]],
   });
  }

  public sendLogin(){
    let dataLoginForm = <FormGroup>(this.loginForm);      
      
    if(dataLoginForm.valid){
      this.loginSrv.sendLogin(dataLoginForm).pipe(
        finalize( () => {  /* this.spinner.hide(); */ })
     )
     .subscribe(
     ( res: any ) => {
        this.router.navigate(['/admin-panel']);
     },
     ( err: any ) => {
        alert( 'ERROR :: NO SE PUDO ENVIAR COTIZACION' );
     });
    }
  }

}
