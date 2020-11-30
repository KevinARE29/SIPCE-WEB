import { Component, OnInit } from '@angular/core';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
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

  constructor(private questionBankService: QuestionBankService, private notification: NzNotificationService) {}

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

  showConfirm(id: number) {
    console.log(id);
  }
}
