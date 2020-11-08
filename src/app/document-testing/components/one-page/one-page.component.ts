import { Component, OnInit } from '@angular/core';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-one-page',
  templateUrl: './one-page.component.html',
  styleUrls: ['./one-page.component.css']
})
export class OnePageComponent implements OnInit {
  today: string;
  listOfData: { id: number; text: string; anotherText: string }[];

  constructor() {}

  ngOnInit(): void {
    this.today = format(new Date(), 'd/MMMM/yyyy', { locale: es });

    this.listOfData = new Array<{ id: number; text: string; anotherText: string }>();
    for (let i = 0; i < 10; i++) {
      this.listOfData.push({ id: i + 1, text: `Nombre del estudiante ${i + 1}`, anotherText: `Grado ${i + 1}`});
    }
    console.log(this.listOfData);
  }
}
