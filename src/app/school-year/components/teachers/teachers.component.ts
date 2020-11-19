import { Component, Input, OnInit } from '@angular/core';

import { Catalogs } from '../../shared/catalogs.model';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown;
  @Input() isValid: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
