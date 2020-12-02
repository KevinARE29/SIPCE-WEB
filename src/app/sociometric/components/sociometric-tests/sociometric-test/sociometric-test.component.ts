import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { SociometricTest } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.model';
import { SociometricTestService } from 'src/app/sociometric/shared/sociometric-test/sociometric-test.service';
import { Student } from 'src/app/students/shared/student.model';

@Component({
  selector: 'app-sociometric-test',
  templateUrl: './sociometric-test.component.html',
  styleUrls: ['./sociometric-test.component.css']
})
export class SociometricTestComponent implements OnInit {
  loading = false;
  sociometricTest: SociometricTest;
  listOfColumn: {
    title: string;
    compare: unknown;
    priority: number;
  }[];

  // Update
  btnLoading = false;
  sociometricTestForm!: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private message: NzMessageService,
    private notification: NzNotificationService,
    private sociometricTestService: SociometricTestService
  ) {}

  ngOnInit(): void {
    this.sociometricTest = new SociometricTest();
    this.getSociometricTest();

    this.setTableSettings();
  }

  getSociometricTest(): void {
    this.route.paramMap.subscribe((params) => {
      const param: string = params.get('sociometrictest');
      let id: number;

      if (typeof param === 'string' && !Number.isNaN(Number(param))) {
        this.loading = true;
        id = Number(param);

        this.sociometricTestService.getSociometricTest(id).subscribe(
          (data) => {
            this.loading = false;
            this.sociometricTest = data['data'];
          },
          () => {
            this.loading = false;
            this.router.navigateByUrl('/pruebas-sociometrica/tests/' + param, {
              skipLocationChange: true
            });
          }
        );
      } else {
        this.router.navigateByUrl('/pruebas-sociometrica/tests/' + param, { skipLocationChange: true });
      }
    });
  }

  setTableSettings(): void {
    this.listOfColumn = [
      {
        title: 'NIE',
        compare: (a: Student, b: Student) => a.code.localeCompare(b.code),
        priority: 1
      },
      {
        title: 'Nombre',
        compare: (a: Student, b: Student) => a.firstname.localeCompare(b.firstname),
        priority: 2
      },
      {
        title: 'Apellido',
        compare: (a: Student, b: Student) => a.lastname.localeCompare(b.lastname),
        priority: 3
      }
    ];
  }
}
