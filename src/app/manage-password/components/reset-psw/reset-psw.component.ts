import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../../shared/reset-password.service';
import { SecurityPolicy } from '../../../security-policies/shared/security-policy.model';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SecurityPolicyService } from '../../../security-policies/shared/security-policy.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-reset-psw',
  templateUrl: './reset-psw.component.html',
  styleUrls: ['./reset-psw.component.css']
})
export class ResetPswComponent implements OnInit {
  resetPwd: FormGroup;
  securityPolicy: SecurityPolicy;
  isLoading = false;
  passwordJson; // variable that contains a validated password
  availablePolitics: string; // string that contains the message of the politics that are available
  regexExpression: string; // dinamic regex expression formed according the available politics
  length: number; // minlegth for a passwprd
  str: string; //substring used in the method lengthAsyncValidator

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private resetPasswordService: ResetPasswordService,
    private securityPolicyService: SecurityPolicyService,
    private notification: NzNotificationService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.resetPwd = this.fb.group({
      password: ['', [Validators.required], [this.politicsAsyncValidator, this.lengthAsyncValidator]],
      confirm: ['', [this.confirmValidator]]
    });

    this.politicsPassword();
  }

  submitForm(value: { password: string; confirm: string }): void {
    for (const key in this.resetPwd.controls) {
      this.resetPwd.controls[key].markAsDirty();
      this.resetPwd.controls[key].updateValueAndValidity();
    }
  }

  get password(): AbstractControl {
    return this.resetPwd.get('password');
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.resetPwd.controls.confirm.updateValueAndValidity());
  }

  politicsAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control && (control.value !== null || control.value !== undefined)) {
          // validationg the password with the available politics
          const regex = new RegExp(this.regexExpression);
          if (!regex.test(control.value)) {
            observer.next({ error: true, invalidExpression: true });
          } else {
            observer.next(null);
          }
        }
        observer.complete();
      }, 300);
    });

  lengthAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control && (control.value !== null || control.value !== undefined)) {
          // validationg if the string has 6 characters
          if (this.securityPolicy.minLength === 0) {
            this.str = control.value;
            if (this.str.length === 6 || this.str.length > 6) {
              observer.next(null);
            } else {
              observer.next({ error: true, minLengthPassword: true });
            }
          } else {
            // validationg if the string has x characters
            this.str = control.value;
            if (this.str.length === this.securityPolicy.minLength || this.str.length > this.securityPolicy.minLength) {
              observer.next(null);
            } else {
              observer.next({ error: true, minLengthPassword: true });
            }
          }
        }
        observer.complete();
      }, 300);
    });

  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.resetPwd.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  sendPassword(): void {
    this.isLoading = true;
    if (this.resetPwd.valid) {
      this.passwordJson = {
        password: this.password.value
      };

      this.resetPasswordService.resetPassword(this.passwordJson).subscribe(
        () => {
          this.isLoading = false;
          this.message.success('Contraseña restablecida con éxito');
          this.router.navigate(['login']);
        },
        (error) => {
          this.isLoading = false;
          this.notification.create(
            'error',
            'Ocurrió un error al cambiar la contraseña. Por favor verifique lo siguiente:',
            error.message,
            { nzDuration: 30000 }
          );
        }
      );
    } else {
      this.isLoading = false;
    }
  }

  getSecurityPolicies(): void {
    this.securityPolicyService.getSecurityPolicies().subscribe((securityPolicy) => {
      this.securityPolicy = securityPolicy;
    });
  }

  politicsPassword(): void {
    this.availablePolitics = ''; // cleaning the message variable
    this.regexExpression = '';

    this.securityPolicyService.getSecurityPolicies().subscribe((securityPolicy) => {
      this.securityPolicy = securityPolicy;

      if (this.securityPolicy.capitalLetter === true) {
        this.availablePolitics = 'mayúsculas' + ', ';
        this.regexExpression = '(?=(?:.*[A-Z]))';
      }

      if (this.securityPolicy.lowerCase === true) {
        this.availablePolitics = this.availablePolitics + 'minúsculas' + ', ';
        this.regexExpression = this.regexExpression + '(?=(?:.*[a-z]))';
      }

      if (this.securityPolicy.numericChart === true) {
        this.availablePolitics = this.availablePolitics + 'números' + ', ';
        this.regexExpression = this.regexExpression + '(?=(?:.*[0-9]))';
      }

      if (this.securityPolicy.specialChart === true) {
        this.availablePolitics =
          this.availablePolitics + 'caracteres especiales como ' + this.securityPolicy.typeSpecial + ', ';
        this.regexExpression = this.regexExpression + '(?=(?:.*[' + this.securityPolicy.typeSpecial + ']))';
      }

      if (this.securityPolicy.minLength === 0) {
        this.length = 6;
        this.availablePolitics = this.availablePolitics + 'al menos 6 caracteres.';
      } else {
        this.availablePolitics = this.availablePolitics + 'al menos ' + this.securityPolicy.minLength + ' caracteres.';
        this.length = this.securityPolicy.minLength;
      }
    });
  }
}
