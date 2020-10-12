import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { WelcomeService } from '../shared/welcome.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  btnLoading = false;
  counselingConsultationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private welcomeService: WelcomeService
  ) {}

  ngOnInit(): void {
    const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    this.counselingConsultationForm = this.fb.group({
      email: [null, [Validators.required, Validators.maxLength(128), Validators.pattern(emailPattern)]],
      subject: [
        null,
        [Validators.required, Validators.maxLength(128), Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$')]
      ],
      comment: [null, [Validators.maxLength(512)]]
    });
  }

  requestConsulation(): void {
    for (const i in this.counselingConsultationForm.controls) {
      this.counselingConsultationForm.controls[i].markAsDirty();
      this.counselingConsultationForm.controls[i].updateValueAndValidity();
    }

    if (this.counselingConsultationForm.valid) {
      const email = this.counselingConsultationForm.controls['email'].value;
      const subject = this.counselingConsultationForm.controls['subject'].value;
      const comment = this.counselingConsultationForm.controls['comment'].value;

      this.btnLoading = true;

      this.welcomeService.requestConsulation(email, subject, comment).subscribe(() => {
        this.counselingConsultationForm.reset();

        this.btnLoading = false;

        this.notification.create(
          'success',
          'Solicitud generada con éxito',
          'Verifica tu correo electrónico institucional para confirmar la solicitud.',
          {
            nzDuration: 30000
        });
      });
    }
  }
}
