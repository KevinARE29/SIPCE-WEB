import { Component } from '@angular/core';

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
          <a routerLink="/bitacora/acciones">Bitácora de acciones</a>
        </div>
      </nz-card>
    </div>
  `,
  styles: []
})
export class LogsRootComponent {
  gridStyle = {
    width: '50%',
    textAlign: 'center'
  };
}
