import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Catalogs } from '../../shared/catalogs.model';
interface ItemData {
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'app-academic-assignments',
  templateUrl: './academic-assignments.component.html',
  styleUrls: ['./academic-assignments.component.css']
})
export class AcademicAssignmentsComponent implements OnInit {
  listOfData: ItemData[] = [];


  @Output() cycleEvent = new EventEmitter<string>();
  @Input() catalogs: Catalogs;//Observable<Catalogs>;

  allCatalogs: Catalogs;
  content: string;

  constructor() {}

  ngOnInit(): void {
    console.log(this.catalogs);
    for (let i = 0; i < 100; i++) {
      this.listOfData.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London`
      });
    }
    // this.catalogs.subscribe((r) => console.log(r));
  }

  // ngOnChanges(changes): void {
  //   console.log(changes);
  //   if (changes.catalogs) {
  //     // deal with asynchronous Observable result
  //     // this.allCatalogs = this.catalogs;
  //     console.log(changes);
  //   }
  // }

  updateField(value: string){
    console.log(value);
    this.cycleEvent.emit(value);
  }
}
