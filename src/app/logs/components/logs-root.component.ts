import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logs-root',
  template: `
  <div>
    <nz-divider nzText="Seleccione una bitácora del menú"></nz-divider>
    <nz-card>
      <div nz-card-grid [ngStyle]="gridStyle">
        <a routerLink="/bitacora/accesos">Bitácora de accesos</a>
      </div>
      <div nz-card-grid [ngStyle]="gridStyle">
        Bitácora de acciones
      </div>
    </nz-card>
  </div>
  `,
  styles: [
  ]
})
export class LogsRootComponent implements OnInit {
  gridStyle = {
    width: '50%',
    textAlign: 'center'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
