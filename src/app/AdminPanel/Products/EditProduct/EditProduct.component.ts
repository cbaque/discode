import { Component, OnInit } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { ListasService } from 'src/app/Services/listas.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-edit-product',
	templateUrl: './EditProduct.component.html',
	styleUrls: ['./EditProduct.component.scss']
})

export class EditProductComponent implements OnInit {

	editProductDetail    : any;
	mainImgPath   			: string;
	productId     			: any;
	productType	 			: any;
	showStatus    			: boolean;
	form			  			: FormGroup;
	colorsArray   			: string[] = ["Red", "Blue", "Yellow", "Green"];
   sizeArray    			: number[] = [36,38,40,42,44,46,48];
   quantityArray 			: number[] = [1,2,3,4,5,6,7,8,9,10];
   categorias: Observable<any[]>;
   subcategorias: Observable<any[]>;
	
	constructor(private adminPanelService : AdminPanelServiceService,
					public formBuilder : FormBuilder,
					private route: ActivatedRoute
					, private listaSrv: ListasService
					   , private router: Router) 
	{ 
		this.categorias = this.listaSrv.getData( 'SYS_CATEGO' );
		this.subcategorias = this.listaSrv.getData( 'SYS_SUBCAT' );
	}

	ngOnInit() {
		if(this.adminPanelService.editProductData) {
			this.editProductDetail = this.adminPanelService.editProductData;
			
			setTimeout(()=>{
				this.mainImgPath = this.editProductDetail.image;
			},0)
		}

	// 	this.route.params.subscribe(res => {
	// 		this.productId = res.id;
    //      this.productType = res.type;
	// 		this.getEditProductDetail();
    //   })

	  console.log( this.editProductDetail  )
   	this.form = this.formBuilder.group({
			name				: [ '',  Validators.required  ],
			price 				: [],
			description 		: [ '', Validators.required ],
			cantidad          : new FormControl( '', [ Validators.required ] ),
			// image             : this.formBuilder.array([]),
			categoria         : new FormControl('', [ Validators.required ] ),
			subcategoria      : new FormControl('', [ Validators.required ] ),
			quantity          : 0,
			// name					: [],
			// price 				: [],
			// availablity   		: [],
			// product_code 		: [],
			// description 		: [],
			// tags					: [],
			// features				: []
		});
   	this.getProductData();
	}

	/**
    * getImagePath is used to change the image path on click event. 
    */
   public getImagePath(imgPath: string, index:number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index+'_img').className += " border-active";
   }

   //getEditProductDetail method is used to get the edit product.
	public getEditProductDetail() {
      this.productId = (this.productId) ? this.productId : 1;
      this.productId = (this.productId) ? this.productId : 'Business';
      this.adminPanelService.getProducts().valueChanges().
      	subscribe(res => {this.getProductEditResponse(res)});
   }

   //getProductEditResponse method is used to according to the response edit poroduct data show.
   public getProductEditResponse(response) {
		let products = ((response.men.concat(response.women)).concat(response.gadgets)).concat(response.accessories);
      for(let data of products)
      {	
         if(data.id == this.productId && data.type == this.productType) {
            this.editProductDetail = data;
				this.mainImgPath = this.editProductDetail.image;
				this.getProductData();
            break;
         }
      }
	}

	//getProductData method is used to get the product data.
	getProductData(){
		if(this.editProductDetail){
			this.form.patchValue({
				name   		 	: this.editProductDetail.producto,
				price 		 	: this.editProductDetail.precio,
				description 	: this.editProductDetail.descripcion,
				cantidad        : this.editProductDetail.stock,
				// image             : this.formBuilder.array([]),
				categoria       : this.editProductDetail.id_categoria,
				subcategoria    : this.editProductDetail.id_subcategoria,
				quantity        : 0,
			});
		}
	}
}
