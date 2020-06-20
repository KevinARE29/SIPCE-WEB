import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordService } from '../shared/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {
  resetPassword!: FormGroup;
  show: boolean = true;
  message: boolean = false;
  btnLoading:boolean = false;

  constructor(
    private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService
  ) { }

  ngOnInit(): void {
    this.resetPassword = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendEmail() {
    // validating the form 
    for (const i in this.resetPassword.controls) {
      this.resetPassword.controls[i].markAsDirty();
      this.resetPassword.controls[i].updateValueAndValidity();
    }

    if (this.resetPassword.valid) {
      this.btnLoading = true;
      this.resetPasswordService.forgotPassword(this.resetPassword.value).subscribe(
        (response) => {
          this.show = false;
          this.btnLoading = true;
        }
      );
    }
    else {
      this.message = true;
    }
  }

}
