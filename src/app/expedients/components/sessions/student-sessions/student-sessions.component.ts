import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { subMonths, differenceInCalendarDays } from 'date-fns';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { SessionService } from '../../../shared/session.service';

import { SessionTypes } from './../../../../shared/enums/session-types.enum';
import { Pagination } from 'src/app/shared/pagination.model';
import { Session } from '../../../shared/session.model';

@Component({
  selector: 'app-student-sessions',
  templateUrl: './student-sessions.component.html',
  styleUrls: ['./student-sessions.component.css']
})
export class StudentSessionsComponent implements OnInit {

  // Param.
  studentId: number;
  expedientId: number;

  searchSessionParams: Session;
  dateRangeSearch: Date[];
  eventTypes: string[];

  // Table variables
  loading = false;
  listOfDisplayData: Session[];
  pagination: Pagination;

  // Modal to create.
  showModal: boolean = false;
  createEventType: string = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private notification: NzNotificationService,
    private modal: NzModalService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59);
    let date = subMonths(currentDate, 1);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

    this.searchSessionParams = new Session();

    this.eventTypes = Object.values(SessionTypes).filter((k) => isNaN(Number(k)));
    
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;

    const paramExpedient = this.route.snapshot.params['expedient'];
    if (typeof paramExpedient === 'string' && !Number.isNaN(Number(paramExpedient))) {
      this.expedientId = Number(paramExpedient);
    }

    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }
  }

  getSessions(params): void {
    this.loading = true;

    this.sessionService.getStudentSessions(this.studentId, this.expedientId, params, this.searchSessionParams).subscribe(
      (data) => {
        this.pagination = data['pagination'];
        this.listOfDisplayData = data['data'];

        this.loading = false;
      },
      (error) => {
        this.loading = false;
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

  confirmDelete(sessionId: number): void {
    this.modal.confirm({
      nzTitle: `¿Desea eliminar la sesión?`,
      nzContent: `Eliminará la sesión. La acción no puede deshacerse.`,
      nzOnOk: () => {
        this.deleteSession(sessionId)
      }
    });
  }

  deleteSession(sessionId: number): void {
    this.sessionService.deleteSession(this.expedientId, this.studentId, sessionId).subscribe(
      () => {
        this.message.success('La sesión ha sido eliminada.');
        this.listOfDisplayData = this.listOfDisplayData.filter((session) => session.id !== sessionId);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al intentar eliminar la sesión.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  onChangeDatePicker(): void {
    if (this.dateRangeSearch.length > 1) {
      this.searchSessionParams.startedAt = this.dateRangeSearch[0];
      this.searchSessionParams.finishedAt = this.dateRangeSearch[1];
    } else {
      this.searchSessionParams.startedAt = null;
      this.searchSessionParams.finishedAt = null;
    }
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days after today
    return differenceInCalendarDays(current, new Date()) > 0;
  };

  setShowModal(showModal: boolean): void {
    this.showModal = showModal;
  }

  createSession(): void {
    if (this.createEventType) {
      this.router.navigate([this.createEventType], {relativeTo: this.route});
    }
  }

  getSessionPath(sessionType): string {
    let path = '';

    switch(sessionType) {
      case SessionTypes.SESION: 
        path = 'sesion-individual';
        break;
      case SessionTypes.ENTREVISTA_DOCENTE:
        path = 'entrevista-docente';
        break;
      case SessionTypes.ENTREVISTA_PADRES:
        path = 'entrevista-responsable';
        break;
    }

    return path;
  } 
}
