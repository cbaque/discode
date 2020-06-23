import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EmbryoService } from '../../../Services/Embryo.service';
import { ProductosService } from 'src/app/Services/productos.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-DetailPage',
  templateUrl: './DetailPage.component.html',
  styleUrls: ['./DetailPage.component.scss']
})
export class DetailPageComponent implements OnInit {

   id: any;
   type: any;
   apiResponse: any;
   singleProductData: any;
   productsList: any;

   constructor(private route: ActivatedRoute,
              private router: Router,
              public embryoService: EmbryoService,
              private prodSrv: ProductosService,
   ) {
   }

   ngOnInit() {
      this.route.params.subscribe(res => {
         this.id = res.id;
         this.type = res.type;
         this.getData();
      });
   }

   public getData() {
      this.prodSrv.getProductossCliente().subscribe( (res: any) => this.checkResponse( res ) );

      // this.embryoService.getProducts().valueChanges().subscribe(res => this.checkResponse(res));
   }


   public checkResponse(response) {
      this.productsList = null;
      this.productsList = response[this.type];
      for (const data of this.productsList) {
         if (data.id_producto === this.id) {
            this.singleProductData = data;
            break;
         }
      }
   }

   // public checkResponse(response) {
   //    this.productsList = null;
   //    this.productsList = response[this.type];
   //    for (const data of this.productsList) {
   //       if (data.id === this.id) {
   //          this.singleProductData = data;
   //          break;
   //       }
   //    }
   // }

   public addToCart(value) {
      this.embryoService.addToCart(value);
   }

   public addToWishList(value) {
      this.embryoService.addToWishlist(value);
   }

}
