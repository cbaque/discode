import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'embryo-MissionVision',
  templateUrl: './MissionVision.component.html',
  styleUrls: ['./MissionVision.component.scss']
})
export class MissionVisionComponent implements OnInit {

   @Input() data : any;

   mission_vision: any = [{
    content: 'Brindar soluciones integrales de codificación de excelente calidad, permitiendo el crecimiento y desarrollo sostenible en base a los requerimientos de nuestros clientes para lograr la máxima satisfacción.',
    heading: 'Misión',
    id: '1',
    image: 'assets/images/our-mission.jpg',
    sub_heading: 'nulla dolor dicta laborum unde molestias ab magni.Lorem ipsum dolor sit amet,consectetur adipisicing elit'
  },
  {
    content: 'Incursionar en la industria de suministros de codificación en las provincias Guayas, Manabí y El Oro, logrando una facturación sostenible y visualizando el retorno de la inversión al cabo de 6 meses, siendo reconocidos por la eficacia, eficiencia y calidad de nuestros productos y servicios.',
    heading: 'Visión',
    id: '2',
    image: 'assets/images/our-vision.jpg',
    sub_heading: 'nulla dolor dicta laborum unde molestias ab magni.Lorem ipsum dolor sit amet,consectetur adipisicing elit'
  }];

   constructor() { }

   ngOnInit() {
     // console.log( this.data );
   }

}
