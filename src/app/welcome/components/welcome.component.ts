import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  btnLoading = false;
  counselingConsultationForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const emailPattern = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);

    this.counselingConsultationForm = this.fb.group({
      email: [null, [Validators.required, Validators.maxLength(128), Validators.pattern(emailPattern)]],
      subject: [
        null,
        [Validators.required, Validators.maxLength(64), Validators.pattern('[A-Za-zäÄëËïÏöÖüÜáéíóúáéíóúÁÉÍÓÚñÑ ]+$')]
      ],
      comment: [null, [Validators.maxLength(256)]]
    });
  }

  requestConsulation(): void {
    // TODO: Add code
    for (const i in this.counselingConsultationForm.controls) {
      this.counselingConsultationForm.controls[i].markAsDirty();
      this.counselingConsultationForm.controls[i].updateValueAndValidity();
    }
  }
}
