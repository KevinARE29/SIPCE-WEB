import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  loading = false;

  panels = [
    {
      active: true,
      disabled: false,
      name: 'Lunes'
    },
    {
      active: false,
      disabled: true,
      name: 'Martes'
    },
    {
      active: false,
      disabled: false,
      name: 'Miércoles'
    },
    {
      active: false,
      disabled: false,
      name: 'Jueves'
    },
    {
      active: false,
      disabled: false,
      name: 'Viernes'
    }
  ];

  data = ['8:00 - 9:00 am', '10:00 - 12:00 am', '2:00 - 3:00 pm'];
  constructor() {}

  ngOnInit(): void {}
}
