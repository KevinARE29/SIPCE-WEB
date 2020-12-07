import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzNotificationService } from 'ng-zorro-antd/notification';
import { StudentSociometricTestService } from 'src/app/sociometric/shared/sociometric-test/student-sociometric-test.service';

@Component({
  selector: 'app-sociometric-test',
  templateUrl: './sociometric-test.component.html',
  styleUrls: ['./sociometric-test.component.css']
})
export class SociometricTestComponent implements OnInit {
  btnLoading = false;
  passwordVisible = false;
  studentTestForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private studentSociometricTestService: StudentSociometricTestService
  ) {}

  ngOnInit(): void {
    const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    this.studentTestForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern(emailPattern)]],
      password: [null, Validators.required]
    });
  }

  access(): void {
    this.btnLoading = true;
    this.studentSociometricTestService.getStudentTest(this.studentTestForm.value).subscribe(
      (data) => {
        this.btnLoading = false;
        console.log(data);
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403, 422];
        this.btnLoading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ingreso fallido.', 'Comprueba que los datos ingresados sean correctos.', {
            nzDuration: 30000
          });
        } else if (statusCode === 422) {
          this.notification.create('error', 'Ingreso fallido.', error.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }
}
