import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { QuestionBank } from 'src/app/sociometric/shared/question-bank.model';
import { QuestionBankService } from 'src/app/sociometric/shared/question-bank.service';

import { Pagination } from './../../../../shared/pagination.model';

@Component({
  selector: 'app-question-banks',
  templateUrl: './question-banks.component.html',
  styleUrls: ['./question-banks.component.css']
})
export class QuestionBanksComponent implements OnInit {
  loading = false;
  listOfDisplayData: unknown[];

  searchBankParam: string;
  pagination: Pagination;

  // Modal
  isVisible = false;
  confirmModal?: NzModalRef;
  currentQuestionBank: QuestionBank;

  constructor(
    private questionBankService: QuestionBankService,
    private message: NzMessageService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.perPage = 10;
    this.pagination.page = 1;
  }

  getQuestionBanks(params: NzTableQueryParams): void {
    const paginate = params ? params.pageIndex !== this.pagination.page : false;
    this.loading = true;

    this.questionBankService.getQuestionBanks(params, this.searchBankParam, paginate).subscribe(
      (data) => {
        this.listOfDisplayData = data['data'];
        this.pagination = data['pagination'];
        this.loading = false;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];
        this.loading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener los bancos de preguntas.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  //#region Modals
  showModal(questionBank: QuestionBank): void {
    this.currentQuestionBank = questionBank;
    this.isVisible = true;
  }

  showConfirm(questionBank: QuestionBank): void {
    console.log(questionBank);
    this.confirmModal = this.modal.confirm({
      nzTitle: `¿Desea eliminar el banco de preguntas "${questionBank.name}"?`,
      nzContent: `Eliminará el banco de preguntas. La acción no puede deshacerse. ¿Desea confirmar la acción?`,

      nzOnOk: () =>
        this.questionBankService
          .deleteQuestionBank(questionBank.id)
          .toPromise()
          .then(() => {
            this.message.success(`El banco de preguntas ${questionBank.name} ha sido eliminado`);
            this.getQuestionBanks(null);
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create('error', 'Ocurrió un error al eliminar el banco de preguntas.', err.message, {
                nzDuration: 30000
              });
            }
          })
    });
  }
  //#endregion
}
