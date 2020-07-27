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
  invalid_login : boolean;

  constructor(private formGroup : FormBuilder,
              private loginSrv: LoginService,
              public router: Router) { }

  ngOnInit() {
    this.loginForm = this.formGroup.group({
      username         : ['', [Validators.required]],
      password          : ['', [Validators.required]],
   });
   this.invalid_login = false;
  }

  public sendLogin(){
    let md5 = require('md5');
    let dataLoginForm = <FormGroup>(this.loginForm);
    dataLoginForm.value['password'] = md5(dataLoginForm.value['password']);
      
    if(dataLoginForm.valid){
      this.loginSrv.sendLogin(dataLoginForm.value).pipe(
        finalize( () => {  /* this.spinner.hide(); */ })
     )
     .subscribe(
     ( res: any ) => {
       if(res != "not_login"){
        this.router.navigate(['/admin-panel']);
       }else{
         this.invalid_login = true;
       }
     },
     ( err: any ) => {
        alert( 'ERROR EN LA PETICION' );
     });
    }
  }

}
