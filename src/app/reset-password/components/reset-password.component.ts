import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../shared/reset-password.service';
import { SecurityPolicy } from '../../security-policies/shared/security-policy.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPwd: FormGroup;
  show: boolean = true;
  message: boolean = false;
  securityPolicy: SecurityPolicy;
  isLoading = false;
  resetPasswordToken  = '';

  ngOnInit(): void {
    this.resetPwd = this.fb.group({
      password: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]],
    });

    this.politicsPassword();
  }

  submitForm(value: { password: string; confirm: string }): void {
    for (const key in this.resetPwd.controls) {
      this.resetPwd.controls[key].markAsDirty();
      this.resetPwd.controls[key].updateValueAndValidity();
    }
    console.log(value);
  }


  validateConfirmPassword(): void {
    setTimeout(() => this.resetPwd.controls.confirm.updateValueAndValidity());
  }

  /*
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });
*/
    confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
        return { error: true, required: true };
      } else if (control.value !== this.resetPwd.controls.password.value) {
        return { confirm: true, error: true };
      }
      return {};
    };

  constructor(private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private router: Router,
  //  private activatedRoute: ActivatedRoute
    ) {
  //    this.activatedRoute.queryParams.subscribe(data => {
// this.resetPasswordToken =data.resetPasswordToken;
// console.log(this.resetPasswordToken);
 //     });
     }



  sendPassword() {
    this.isLoading = true;
    // validating the form 
    for (const i in this.resetPwd.controls) {
      this.resetPwd.controls[i].markAsDirty();
      this.resetPwd.controls[i].updateValueAndValidity();
    }
    
    if (this.resetPwd.valid) {
      this.isLoading = false;
     // console.log(this.resetPassword.value)
     // this.resetPasswordService.forgotPassword(this.resetPassword.value).subscribe(
       // (response) => {
         // this.show = false;
        // },
        // (error) => {
         // console.log('entro al error');
        // }
     // );
    } else {
     // this.isLoading = false;
    }
  }
 
  politicsPassword() {
    this.resetPasswordService.getPolitics().subscribe(
       (response) => {
        // this.show = false;
        console.log(response);
       // }
        },
        (error) => {
        console.log('entro al error');
        }
     );
  }


}
