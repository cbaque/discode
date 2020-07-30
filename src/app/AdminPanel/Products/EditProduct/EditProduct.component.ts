import { Component, OnInit } from '@angular/core';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { ListasService } from 'src/app/Services/listas.service';
import { Observable } from 'rxjs';
import { ProductosService } from 'src/app/Services/productos.service';
import { finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const apiIMG = environment.apiImg;

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
	filesToUpload: Array<File> = [];
	arrayImages: FormArray;
	IMG: any = apiIMG;

   data: any = [
		{
			image: 'https://via.placeholder.com/625x800',
			image_gallery: [
				'https://via.placeholder.com/625x800',
				'https://via.placeholder.com/625x800',
				'https://via.placeholder.com/625x800',
				'https://via.placeholder.com/625x800',
				'https://via.placeholder.com/625x800'
			]
		}
	 ];
	 
	imageGallery: Observable<[]>;
	
	constructor(private adminPanelService : AdminPanelServiceService,
					public formBuilder : FormBuilder,
					private route: ActivatedRoute
					, private listaSrv: ListasService
					   , private router: Router
					   ,private dataSrv: ProductosService) 
	{ 
		this.categorias = this.listaSrv.getData( 'SYS_CATEGO' );
		this.subcategorias = this.listaSrv.getData( 'SYS_SUBCAT' );
	}

	ngOnInit() {
		if(this.adminPanelService.editProductData) {
			this.editProductDetail = this.adminPanelService.editProductData;
			
			// setTimeout(()=>{
			// 	this.mainImgPath = this.editProductDetail.image;
			// },0)
		}

		this.form = this.formBuilder.group({
				id_producto					: [ '',  Validators.required  ],
				name				: [ '',  Validators.required  ],
				price 				: [],
				description 		: [ '', Validators.required ],
				cantidad          : new FormControl( '', [ Validators.required ] ),
				image             : this.formBuilder.array([]),
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

		this.mainImgPath = this.IMG + '/' + this.editProductDetail.image;

		this.arrayImages = this.form.get('image') as FormArray;

		this.data[0].image_gallery.forEach(element => {
			this.arrayImages.push(
			   this.formBuilder.group({ image: element })
			);
		 });


		this.dataSrv.getProductosImages( this.editProductDetail.id_producto )
		.subscribe( (res: any) => {
			res.forEach( (element: any, index: number) => {
				// this.arrayImages[index].push(this.formBuilder.group({ image: this.IMG + '/' + element.image }));

				this.arrayImages.controls[index].patchValue( { image: this.IMG + '/' + element.image } );
			})
		})
		// this.imageGallery = this.dataSrv.getProductosImages( this.editProductDetail.id_producto );
		
		// this.dataSrv.getProductosImages( this.editProductDetail.id_producto ).forEach(element => {
		// 	element.forEach(element2 => {
		// 		this.arrayImages.push(
		// 			this.formBuilder.group({ image: element2 })
		// 		);	
		// 	});
		// });

		// console.log(this.arrayImages);
		
	}

	/**
    * getImagePath is used to change the image path on click event. 
    */
	public getImagePath(imgPath: string, index: number) {
		document.querySelector('.border-active').classList.remove('border-active');
		this.mainImgPath = imgPath;
		document.getElementById(index + '_img').className += ' border-active';
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
				id_producto		: this.editProductDetail.id_producto,
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

	public editProducto( ev: any ) {

		// this.spinner.show();
		// console.log( this.form.value.image.filter( (x: any ) => x.image !== 'https://via.placeholder.com/625x800' ) );
  
		this.form.value.image = this.form.value.image.filter( (x: any ) => x.image !== 'https://via.placeholder.com/625x800' );

		this.dataSrv.editProducto( this.form.value )
		.pipe(
		   finalize( () => {  /* this.spinner.hide(); */ })
		)
		.subscribe(
		( res: any ) => {
		   alert( res );
		   this.form.reset();
		},
		( err: any ) => {
		   alert( 'ERROR :: NO SE PUDO GUARDAR EL PRODUCTO' );
		});
	}

	addingFiles(e: any, i: number) {

		const image = e.target.files[0];
  
		const reader = new FileReader();
  
		reader.readAsDataURL( image );
  
		reader.onload = () => {
		   this.mainImgPath = reader.result as string;
		   this.arrayImages.controls[i].patchValue( { image: reader.result } );
		   // this.arrayImages.push(
		   //    this.formBuilder.group({ image: reader.result })
		   // );
		   // this.form.patchValue({
		   //   image: reader.result
		   // });
		};
  
	 }
}
