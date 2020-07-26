import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { ListasService } from 'src/app/Services/listas.service';
import { Observable } from 'rxjs';
import { ProductosService } from 'src/app/Services/productos.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';

@Component({
   selector: 'app-add-product',
   templateUrl: './AddProduct.component.html',
   styleUrls: ['./AddProduct.component.scss']
})

export class AddProductComponent implements OnInit {

   form: FormGroup;
   mainImgPath: string;
   categorias: Observable<any[]>;
   subcategorias: Observable<any[]>;
   // images: FormArray;
   // formData: FormData;
   @ViewChild('inputFile', { static: false }) inputFile: ElementRef;
   filesToUpload: Array<File> = [];
   arrayImages: FormArray;

   // colorsArray   : string[] = ["Red", "Blue", "Yellow", "Green"];
   // sizeArray     : number[] = [36,38,40,42,44,46,48];
   // quantityArray : number[] = [1,2,3,4,5,6,7,8,9,10];

   // public imagePath;
   // imgSrc: string;
   // selectedfile;
   // image: any;

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

   constructor(
      public formBuilder: FormBuilder
      , private listaSrv: ListasService
      , private dataSrv: ProductosService
      // , private spinner: NgxSpinnerService
   ) { }

   ngOnInit() {

      this.categorias = this.listaSrv.getData( 'SYS_CATEGO' );
      this.subcategorias = this.listaSrv.getData( 'SYS_SUBCAT' );


      this.mainImgPath = this.data[0].image;
      this.form = this.formBuilder.group({
         name					: [ '',  Validators.required  ],
         price 				: [],
         // availablity   		: [],
         // product_code 		: [],
         description 		: [ '', Validators.required ],
         // tags					: [],
         // features				: [],
         cantidad          : new FormControl(1, [ Validators.required ] ),
         // image             : [ '', Validators.required ],
         image             : this.formBuilder.array([]),
         categoria         : new FormControl('', [ Validators.required ] ),
         subcategoria      : new FormControl('', [ Validators.required ] ),
         // quantity          : 0,
      });


      this.arrayImages = this.form.get('image') as FormArray;

      this.data[0].image_gallery.forEach(element => {
         this.arrayImages.push(
            this.formBuilder.group({ image: element })
         );
      });

   }

   // onUpload() {
   //    this.inputFile.nativeElement.click();
   // }

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

   get f() {
      return this.form.controls;
    }

   saveProduct( ev: any ) {

      // this.spinner.show();
      // console.log( this.form.value.image.filter( (x: any ) => x.image !== 'https://via.placeholder.com/625x800' ) );

      this.form.value.image = this.form.value.image.filter( (x: any ) => x.image !== 'https://via.placeholder.com/625x800' );

      this.dataSrv.setProducto( this.form.value )
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

   /**
    * getImagePath is used to change the image path on click event. 
    */
   public getImagePath(imgPath: string, index: number) {
      document.querySelector('.border-active').classList.remove('border-active');
      this.mainImgPath = imgPath;
      document.getElementById(index + '_img').className += ' border-active';
   }
}
