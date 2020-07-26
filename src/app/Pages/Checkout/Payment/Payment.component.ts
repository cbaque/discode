import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder,FormArray, Validators } from '@angular/forms';
import { EmbryoService } from '../../../Services/Embryo.service';
import { Router, NavigationEnd } from '@angular/router';
import { EmailService } from 'src/app/Pages/Checkout/Payment/email.service';
import { finalize } from 'rxjs/operators';
import { ToastaService, ToastaConfig, ToastOptions, ToastData } from 'ngx-toasta';

@Component({
  selector: 'app-Payment',
  templateUrl: './Payment.component.html',
  styleUrls: ['./Payment.component.scss']
})
export class PaymentComponent implements OnInit, AfterViewInit{

   step = 0;
   isDisabledPaymentStepTwo  = true;
   isDisabledPaymentStepThree = false;
   emailPattern        : any = /\S+@\S+\.\S+/;
   offerCards : any = [
      {
         id: 1,
         name:"Debit Card",
         content: "Visa Mega Shopping Offer"
      },
      {
         id: 2,
         name:"Credit Card",
         content: "American Express 20% Flat"
      },
      {
         id: 3,
         name:"Debit Card",
         content: "BOA Buy 1 Get One Offer"
      },
      {
         id: 4,
         name:"Master Card",
         content: "Mastercard Elite Card"
      },
      {
         id: 5,
         name:"Debit Card",
         content: "Visa Mega Shopping Offer"
      }
   ]

   bankCardsImages : any = [
      {
         id:1,
         image:"assets/images/client-logo-1.png"
      },
      {
         id:2,
         image:"assets/images/client-logo-2.png"
      },
      {
         id:3,
         image:"assets/images/client-logo-3.png"
      },
      {
         id:4,
         image:"assets/images/client-logo-4.png"
      },
      {
         id:5,
         image:"assets/images/client-logo-5.png"
      }
   ]

   paymentFormOne   : FormGroup;

   constructor(public embryoService : EmbryoService, 
               private formGroup : FormBuilder,
               public router: Router, 
               private emailSrv: EmailService,
               private toastyService: ToastaService,
               private toastyConfig: ToastaConfig) {

      this.toastyConfig.position = 'top-right';
      this.toastyConfig.theme = 'material';

      this.embryoService.removeBuyProducts();
   }

   ngOnInit() {

      this.paymentFormOne = this.formGroup.group({
         user_details       : this.formGroup.group({
            first_name         : ['', [Validators.required]],
            last_name          : ['', [Validators.required]],
            city_state         : ['', [Validators.required]],
            country            : ['', [Validators.required]],
            mobile             : ['', [Validators.required]],
            email              : ['', [Validators.required, Validators.pattern(this.emailPattern)]],
         })
      });
   }

   ngAfterViewInit() {
   }

   public setStep(index: number) {
      this.step = index;
      switch (index) {
         case 0:
            this.isDisabledPaymentStepTwo = true;
            this.isDisabledPaymentStepThree = true;
            break;
         case 1:
            this.isDisabledPaymentStepThree = false;
            break;
         default:
            
            break;
      }
   }

   public toggleRightSidenav() {
      this.embryoService.paymentSidenavOpen = !this.embryoService.paymentSidenavOpen;
   }

   public getCartProducts() {
      let total = 0;
      if(this.embryoService.localStorageCartProducts && this.embryoService.localStorageCartProducts.length>0) {
         for(let product of this.embryoService.localStorageCartProducts) {
            if(!product.quantity){
               product.quantity = 1;
            }
            total += (product.price*product.quantity);
         }
         total += (this.embryoService.shipping+this.embryoService.tax);
         return total;
      } 
      return total; 
   }

   public submitPayment() {
      let userDetailsGroup = <FormGroup>(this.paymentFormOne.controls['user_details']);      
      
      if(userDetailsGroup.valid)
      {
         const toastOptionWait: ToastOptions = {
            title: 'Solicitud de cotización',
            msg: 'Enviando correo para solicitud de cotización',
            theme: 'material'
         };

         this.toastyService.wait(toastOptionWait);

         let cartProducts = {
            'cart_products': Object.assign({}, this.embryoService.getCartProducts())
         };

         let dataForQuotation = Object.assign(this.paymentFormOne.value, cartProducts);
         
         this.emailSrv.sendEmail(dataForQuotation).pipe(
            finalize( () => {  /* this.spinner.hide(); */ })
         )
         .subscribe(
         ( res: any ) => {
            this.toastyService.clearAll();

            const toastOptionSuccess: ToastOptions = {
               title: 'Solicitud de cotización',
               msg: res,
               theme: 'material'
            };

            this.toastyService.success(toastOptionSuccess);
            localStorage.removeItem('cart_item');
            localStorage.setItem('cart_item', null);
            this.embryoService.calculateLocalCartProdCounts();
            this.paymentFormOne.reset();
         },
         ( err: any ) => {
            alert( 'ERROR :: NO SE PUDO ENVIAR COTIZACION' );
         });
      } else {
         this.isDisabledPaymentStepTwo = true;
         this.isDisabledPaymentStepThree = true;
         for (let i in userDetailsGroup.controls) {
            userDetailsGroup.controls[i].markAsTouched();
         }
      }
   }

   public selectedPaymentTabChange(value) {
      let paymentGroup = <FormGroup>(this.paymentFormOne.controls['payment']); 

      paymentGroup.markAsUntouched();

      if(value && value.index == 1) {
            paymentGroup.controls['card_number'].clearValidators();
            paymentGroup.controls['user_card_name'].clearValidators();
            paymentGroup.controls['cvv'].clearValidators();
            paymentGroup.controls['expiry_date'].clearValidators();

            paymentGroup.controls['bank_card_value'].setValidators([Validators.required]); 
      } else {
        
         paymentGroup.controls['card_number'].setValidators([Validators.required]); 
         paymentGroup.controls['user_card_name'].setValidators([Validators.required]); 
         paymentGroup.controls['cvv'].setValidators([Validators.required]); 
         paymentGroup.controls['expiry_date'].setValidators([Validators.required]); 

         paymentGroup.controls['bank_card_value'].clearValidators();
      }

      paymentGroup.controls['card_number'].updateValueAndValidity();
      paymentGroup.controls['user_card_name'].updateValueAndValidity();
      paymentGroup.controls['cvv'].updateValueAndValidity();
      paymentGroup.controls['expiry_date'].updateValueAndValidity();
      paymentGroup.controls['bank_card_value'].updateValueAndValidity();
   }

   public finalStep() {
      let paymentGroup = <FormGroup>(this.paymentFormOne.controls['payment']);
      if(paymentGroup.valid) {
         this.embryoService.addBuyUserDetails(this.paymentFormOne.value);
         this.router.navigate(['/checkout/final-receipt']);
      } else {
         for (let i in paymentGroup.controls) {
            paymentGroup.controls[i].markAsTouched();
         }
      }
   }
}



