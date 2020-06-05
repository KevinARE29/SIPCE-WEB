import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private router: Router) { }

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
      console.log(this.resetPassword.value)
      this.resetPasswordService.forgotPassword(this.resetPassword.value).subscribe(
        (response) => {
          this.show = false;
        },
        (error) => {
          console.log('entro al error');
        }
      );
    }
    else {
      this.message = true;
    }
  }

}
