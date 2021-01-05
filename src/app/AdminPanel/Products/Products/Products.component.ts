import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { AdminPanelServiceService } from '../../Service/AdminPanelService.service';
import { ProductosService } from 'src/app/Services/productos.service';
import { environment } from 'src/environments/environment';

const apiIMG = environment.apiImg;

@Component({
	selector: 'app-products',
	templateUrl: './Products.component.html',
	styleUrls: ['./Products.component.scss']
})

export class ProductsComponent implements OnInit {
	
	productsList 		      : any;
	productsGrid 			   : any;
	popUpDeleteUserResponse : any;
	showType	    				: string = 'grid';
	IMG: any = apiIMG;
	// displayedProductColumns : string [] = ['id', 'image','name','brand','category', 'product_code', 'discount_price', 'price','action' ];


	displayedProductColumns : string [] = ['image','producto','categoria', 'subcategoria', 'precio', 'action' ];

	@ViewChild(MatPaginator,{static: false}) paginator : MatPaginator;
	@ViewChild(MatSort,{static: false}) sort           : MatSort;

	constructor(public translate : TranslateService,
					private router : Router, 
					private adminPanelService : AdminPanelServiceService,
					private productoSrv: ProductosService
	) { }

	ngOnInit() {
		// this.adminPanelService.getProducts().valueChanges()
		// .subscribe(res => {
		// 	console.log( res )
		// 	this.getProductResponse(res)
		// });

		this.productoSrv.getProducts()
		.subscribe(res => {
			this.getProductResponse(res)
		});

		
	}

	//getProductResponse method is used to get the response of all products.
 	public getProductResponse(response) {
	  this.productsGrid = null;
	  let products = response;
      // let products = ((response.men.concat(response.women)).concat(response.gadgets)).concat(response.accessories);
      this.productsGrid = products;
   }

  	/**
	  * productShowType method is used to select the show type of product.
	  */
	productShowType(type) {
		this.showType = type;
		if(type == 'list'){
			document.getElementById('list').classList.add("active");
			document.getElementById('grid').classList.remove('active');
			this.productsList = new MatTableDataSource(this.productsGrid);
			setTimeout(()=>{
				this.productsList.paginator = this.paginator;
				this.productsList.sort = this.sort;
			},0)
			
		}
		else{
			document.getElementById('grid').classList.add("active");
			document.getElementById('list').classList.remove('active');
		}
	}

	/**
	  * onEditProduct method is used to open the edit page and edit the product.
	  */
	onEditProduct(data){

		this.router.navigate(['/admin-panel/product-edit',data.codigo_categoria,data.id_producto]);
		this.adminPanelService.editProductData = data;
	}

	/* 
     *deleteProduct method is used to open a delete dialog.
     */
   deleteProduct(i: number, id: number){
	   
      this.adminPanelService.deleteDialog("¿Esta seguro de Eliminar Producto?").
         subscribe( res => { this.popUpDeleteUserResponse = res },
                    err => console.log(err),
                    ()  => this.getDeleteResponse(this.popUpDeleteUserResponse,i, id))
   }

   /**
     * getDeleteResponse method is used to delete a product from the product list.
     */
   getDeleteResponse(response : string,i: number, id: number){

		if(response == "yes") {
			this.productoSrv.deleteProducto( { id_producto: id } )
			.subscribe(res => {
				
				if(this.showType == 'grid') {
	
					this.productsGrid.splice(i,1);
					
				}else if(this.showType == 'list') {
	
					this.productsList.data.splice(i,1);
					this.productsList = new MatTableDataSource(this.productsList.data);
					this.productsList.paginator = this.paginator;
	
				}

			});

		}
   }
}
