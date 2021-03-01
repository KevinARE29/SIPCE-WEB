import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { differenceInCalendarDays, differenceInHours } from 'date-fns';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

// Model and services.
import { Annotation } from '../../shared/annotation.model';
import { Pagination } from 'src/app/shared/pagination.model';
import { AnnotationsService } from '../../shared/annotations.service';
import { UserService } from '../../../users/shared/user.service';
import { User } from 'src/app/users/shared/user.model';

@Component({
  selector: 'app-history-annotations',
  templateUrl: './history-annotations.component.html',
  styleUrls: ['./history-annotations.component.css']
})
export class HistoryAnnotationsComponent implements OnInit, OnChanges {
  @Input() studentId: number;
  @Input() historyId: number;
  @Input() currentUser: number;

  @Input() isEditable: boolean;
  @Input() showAdd: boolean;
  @Input() showEdit: boolean;
  @Input() showDelete: boolean;

  // Table variables
  loadingData = false;
  listOfDisplayData: Annotation[];
  pagination: Pagination;

  // Users
  userResults: User[] = [];
  loadingUsers = false;

  // Expand table
  expandSet = new Set<number>();

  // Search params.
  search: Annotation;
  dateRangeSearch: Date[];

  // Modal.
  showModal = false;
  modalTitle: string;
  annotationModal: Annotation;
  form: FormGroup;

  constructor(
    private annotationsService: AnnotationsService,
    private userService: UserService,
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.search = new Annotation();
    this.search.reporter = new User();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    this.getUsers();
  }

  ngOnChanges(): void {
    this.search = new Annotation();
    this.search.reporter = new User();

    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    this.getAnnotations(null);
  }

  getAnnotations(params: NzTableQueryParams): void {
    this.loadingData = true;

    this.annotationsService.getAnnotations(this.studentId, this.historyId, params, this.search).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'].map((annotation: Annotation) => {
          annotation.editable =
            this.isEditable &&
            this.currentUser === annotation.reporter.id &&
            differenceInHours(new Date(), new Date(annotation.createdAt)) < 24;

          return annotation;
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

  // Users list.
  getUsers(): void {
    this.loadingUsers = true;
    this.userService.getUserByUsername('').subscribe((r) => {
      this.userResults = r['data'];
      this.loadingUsers = false;
    });
  }

  // Search dates.
  onChangeDatePicker(): void {
    if (this.dateRangeSearch.length > 1) {
      this.search.startedAt = this.dateRangeSearch[0];
      this.search.finishedAt = this.dateRangeSearch[1];
    } else {
      this.search.startedAt = null;
      this.search.finishedAt = null;
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

  openModal(annotation: Annotation): void {
    this.modalTitle = annotation ? 'Editar anotación' : 'Agregar anotación';
    this.annotationModal = annotation;

    this.form = this.fb.group({
      title: [
        this.annotationModal ? this.annotationModal.title : null,
        [Validators.required, Validators.maxLength(64)]
      ],
      description: [this.annotationModal ? this.annotationModal.description : null, [Validators.required]],
      annotationDate: [this.annotationModal ? this.annotationModal.annotationDate : null, [Validators.required]]
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

      if (!this.annotationModal) {
        this.annotationModal = new Annotation();
      }

      this.annotationModal.title = formValue['title'];
      this.annotationModal.description = formValue['description'];
      this.annotationModal.annotationDate = formValue['annotationDate'];

      this.annotationsService.saveAnnotation(this.studentId, this.historyId, this.annotationModal).subscribe(
        (response) => {
          if (this.annotationModal.id) {
            this.message.success('La anotación ha sido actualizada');
          } else {
            this.annotationModal.id = response['data'].id;
            this.annotationModal.editable = true;
            this.annotationModal.reporter = this.userResults.find((user) => user.id === this.currentUser);
            this.listOfDisplayData.push(this.annotationModal);

            this.notification.create(
              'success',
              'La anotación ha sido creada.',
              'La edición y eliminación de la anotación se deshabilitará en 24 horas',
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
            this.notification.create('error', 'Ocurrió un error al intentar registrar la anotación.', error.message, {
              nzDuration: 30000
            });
          }
        }
      );
    }
  }

  // Delete annotation.
  confirmDelete(annotation: Annotation): void {
    this.modal.confirm({
      nzTitle: `¿Desea eliminar la anotación?`,
      nzContent: `Eliminará la anotación. La acción no puede deshacerse. ¿Desea continuar?`,
      nzOnOk: () => {
        this.deleteAnnotation(annotation);
      }
    });
  }

  deleteAnnotation(annotation: Annotation): void {
    this.annotationsService.deleteAnnotation(this.studentId, this.historyId, annotation.id).subscribe(
      () => {
        this.message.success('La anotación ha sido eliminada.');
        this.listOfDisplayData = this.listOfDisplayData.filter((a) => a.id !== annotation.id);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar eliminar la anotación.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
