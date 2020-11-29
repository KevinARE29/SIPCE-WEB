import { Component, OnInit } from '@angular/core';

import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-question-banks',
  templateUrl: './question-banks.component.html',
  styleUrls: ['./question-banks.component.css']
})
export class QuestionBanksComponent implements OnInit {
  searchBankParam: string;

  constructor() {}

  ngOnInit(): void {}

  getQuestionBanks(params: NzTableQueryParams): void {
    console.log('loading...', params);
  }
}
