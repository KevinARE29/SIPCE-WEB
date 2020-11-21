import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

// Models and services
import { InterventionProgram } from '../../../shared/intervention-program.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { InterventionProgramService } from '../../../shared/intervention-program.service';
import { InterventionProgramTypes } from './../../../../shared/enums/intervention-program-types.enum';

@Component({
  selector: 'app-intervention-programs-list',
  templateUrl: './intervention-programs-list.component.html',
  styleUrls: ['./intervention-programs-list.component.css']
})
export class InterventionProgramsListComponent implements OnInit {

  // Table variables
  loadingData = false;
  listOfDisplayData: InterventionProgram[];
  pagination: Pagination;

  // Expant table
  expandSet = new Set<number>();

  // Search params.
  search: InterventionProgram;

  // Enum
  programTypes: string[];

  constructor(
    private programService: InterventionProgramService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.search = new InterventionProgram();
    this.programTypes = Object.values(InterventionProgramTypes).filter((k) => isNaN(Number(k)));

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  getPrograms(params): void {
    this.loadingData = true;

    this.programService.getPrograms( params, this.search).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];

        this.loadingData = false;
      },
      (error) => {
        this.loadingData = false;
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar recuperar los datos.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  // Expand table
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  confirmDelete(program: InterventionProgram): void {
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el programa ${program.name}?`,
      nzContent: `Eliminará la programa ${program.name}. La acción no puede deshacerse.`,
      nzOnOk: () => {
        this.deleteProgram(program);
      }
    });
  }

  deleteProgram(deleteProgram: InterventionProgram): void {
    this.programService.deleteProgram(deleteProgram.id).subscribe(
      () => {
        this.message.success('El programa ha sido eliminado.');
        this.listOfDisplayData = this.listOfDisplayData.filter((program) => program.id !== deleteProgram.id);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar eliminar el programa.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
