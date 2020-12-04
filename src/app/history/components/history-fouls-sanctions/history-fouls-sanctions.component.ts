import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { differenceInCalendarDays, differenceInHours } from 'date-fns';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

// Model and services.
import { Pagination } from 'src/app/shared/pagination.model';
import { FoulsSanctionsService } from '../../shared/fouls-sanctions.service';
import { FoulAssignation } from '../../shared/foul-assignation.model';

import { ShiftPeriodGrade } from 'src/app/academic-catalogs/shared/shiftPeriodGrade.model';
import { PeriodService } from 'src/app/academic-catalogs/shared/period.service';

import { DisciplinaryCatalogService } from 'src/app/disciplinary-catalogs/shared/disciplinary-catalog.service';
import { Foul } from 'src/app/disciplinary-catalogs/shared/foul.model';
import { Sanction } from 'src/app/disciplinary-catalogs/shared/sanction.model';

@Component({
  selector: 'app-history-fouls-sanctions',
  templateUrl: './history-fouls-sanctions.component.html',
  styleUrls: ['./history-fouls-sanctions.component.css']
})
export class HistoryFoulsSanctionsComponent implements OnInit, OnChanges {
  @Input() studentId: number;
  @Input() historyId: number;

  @Input() isEditable: boolean;
  @Input() showAdd: boolean;
  @Input() showEdit: boolean;
  @Input() showDelete: boolean;

  // Table variables
  loadingData = false;
  listOfDisplayData: FoulAssignation[];
  pagination: Pagination;

  // Catalogs.
  periods: ShiftPeriodGrade[];
  loadingPeriods = false;

  fouls: Foul[];
  loadingFouls = false;

  sanctions: Sanction[];
  loadingSanctions = false;

  // Expant table
  expandSet = new Set<number>();

  // Search params.
  search: FoulAssignation;
  createdDateRangeSearch: Date[];
  issueDateRangeSearch: Date[];

  // Modal.
  showModal = false;
  modalTitle: string;
  assignationModal: FoulAssignation;
  form: FormGroup;

  constructor(
    private assignationService: FoulsSanctionsService,
    private disciplinaryService: DisciplinaryCatalogService,
    private periodService: PeriodService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.search = new FoulAssignation();
    this.search.period = new ShiftPeriodGrade();
    this.search.foul = new Foul();
    this.search.sanction = new Sanction();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    // Load catalogs.
    this.loadingPeriods = true;
    this.periodService.getAllPeriods().subscribe((r) => {
      this.periods = r['data'];
      this.loadingPeriods = false;
    });

    this.loadingFouls = true;
    this.disciplinaryService.getFouls(null, null, false).subscribe((r) => {
      this.fouls = r['data'];
      this.loadingFouls = false;
    });

    this.loadingSanctions = true;
    this.disciplinaryService.searchSanctions(null, null, false).subscribe((r) => {
      this.sanctions = r['data'];
      this.loadingSanctions = false;
    });
  }

  ngOnChanges(): void {
    this.search = new FoulAssignation();
    this.search.period = new ShiftPeriodGrade();
    this.search.foul = new Foul();
    this.search.sanction = new Sanction();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    this.getAssignations(null);
  }

  getAssignations(params: NzTableQueryParams): void {
    this.loadingData = true;

    this.assignationService.getAssignations(this.studentId, this.historyId, params, this.search).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'].map((assignation: FoulAssignation) => {
          assignation.editable = this.isEditable && differenceInHours(new Date(), new Date(assignation.createdAt)) < 24;

          return assignation;
        });

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

  // Search dates.
  onChangeCreatedDatePicker(): void {
    if (this.createdDateRangeSearch.length > 1) {
      this.search.createdAt = this.createdDateRangeSearch[0];
      this.search.createdEnd = this.createdDateRangeSearch[1];
    } else {
      this.search.createdAt = null;
      this.search.createdEnd = null;
    }
  }

  onChangeIssueDatePicker(): void {
    if (this.issueDateRangeSearch.length > 1) {
      this.search.issueDateStart = this.issueDateRangeSearch[0];
      this.search.issueDateEnd = this.issueDateRangeSearch[1];
    } else {
      this.search.issueDateStart = null;
      this.search.issueDateEnd = null;
    }
  }

  // Expand table
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  // Create / update modal.
  setShowModal(show: boolean): void {
    this.showModal = show;
  }

  openModal(assignation: FoulAssignation): void {
    this.modalTitle = assignation ? 'Editar asignación' : 'Agregar asignación';
    this.assignationModal = assignation;

    this.form = this.fb.group({
      foul: [this.assignationModal ? this.assignationModal.foul.id : null, [Validators.required]],
      foulType: [this.assignationModal ? this.assignationModal.foul.foulsType : null, [Validators.required]],
      sanction: [this.assignationModal && this.assignationModal.sanction ? this.assignationModal.sanction.id : null],
      period: [this.assignationModal ? this.assignationModal.period.id : null, [Validators.required]],
      issueDate: [this.assignationModal ? this.assignationModal.issueDate : null, [Validators.required]]
    });

    this.setShowModal(true);
  }

  // Date.
  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  onModalOk(): void {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.valid) {
      const formValue = this.form.value;

      if (!this.assignationModal) {
        this.assignationModal = new FoulAssignation();
      }

      this.assignationModal.foul = this.fouls.find((foul) => foul.id === formValue['foul']);
      this.assignationModal.sanction = this.sanctions.find((sanction) => sanction.id === formValue['sanction']);
      this.assignationModal.period = this.periods.find((period) => period.id === formValue['period']);
      this.assignationModal.issueDate = formValue['issueDate'];

      this.assignationService.saveAssignation(this.studentId, this.historyId, this.assignationModal).subscribe(
        (response) => {
          if (this.assignationModal.id) {
            this.message.success('La asignación ha sido actualizada');
          } else {
            this.assignationModal.id = response['data'].id;
            this.assignationModal.createdAt = response['data'].createdAt;
            this.assignationModal.editable = true;
            this.listOfDisplayData.push(this.assignationModal);

            this.notification.create(
              'success',
              'La asignación ha sido creada.',
              'La edición y eliminación de la asignación se deshabilitará en 24 horas',
              {
                nzDuration: 30000
              }
            );
          }

          this.setShowModal(false);
        },
        (error) => {
          const statusCode = error.statusCode;
          const notIn = [401, 403];

          if (!notIn.includes(statusCode) && statusCode < 500) {
            this.notification.create('error', 'Ocurrió un error al intentar registrar la asignación.', error.message, {
              nzDuration: 30000
            });
          }
        }
      );
    }
  }

  // Delete assignation.
  confirmDelete(assignation: FoulAssignation): void {
    this.modal.confirm({
      nzTitle: `¿Desea eliminar la asignación?`,
      nzContent: `Eliminará la asignación. La acción no puede deshacerse. ¿Desea continuar?`,
      nzOnOk: () => {
        this.deleteAssignation(assignation);
      }
    });
  }

  deleteAssignation(assignation: FoulAssignation): void {
    this.assignationService.deleteAssignation(this.studentId, this.historyId, assignation.id).subscribe(
      () => {
        this.message.success('La asignación ha sido eliminada.');
        this.listOfDisplayData = this.listOfDisplayData.filter((a) => a.id !== assignation.id);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar eliminar la asignación.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
