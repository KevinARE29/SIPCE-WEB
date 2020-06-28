import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl,  ValidationErrors } from '@angular/forms';
import { ResetPasswordService } from '../../shared/reset-password.service';
import { SecurityPolicy } from '../../../security-policies/shared/security-policy.model';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SecurityPolicyService } from '../../../security-policies/shared/security-policy.service';


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
    private resetPasswordService: ResetPasswordService,
    private securityPolicyService: SecurityPolicyService,
    private message: NzMessageService) {
  }

  ngOnInit(): void {
    this.resetPwd = this.fb.group({
      password: ['', [Validators.required], [this.politicsAsyncValidator, this.lengthAsyncValidator]],
      confirm: ['', [this.confirmValidator]],
    });

    this.politicsPassword();
  }

  submitForm(value: { password: string; confirm: string }): void {
    for (const key in this.resetPwd.controls) {
      this.resetPwd.controls[key].markAsDirty();
      this.resetPwd.controls[key].updateValueAndValidity();
    }
  }

  get password() {
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
        console.log(regex);
        if (!regex.test(control.value)) {
          observer.next({ error: true, invalidExpression: true });
        } else {
          observer.next(null);
        }
      }
      observer.complete();
      },300);
    });
  
    lengthAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control && (control.value !== null || control.value !== undefined)) {
          // validationg if the string has 6 characters
          if (this.securityPolicy.minLength === 0) {
            this.str = control.value;
            if ((this.str.length === 6) || (this.str.length > 6) )
            {
              observer.next(null);
            } else {
              observer.next({ error: true, minLengthPassword: true });
            }
          } else {
            // validationg if the string has x characters
            this.str = control.value;
            if ((this.str.length === this.securityPolicy.minLength) || (this.str.length > this.securityPolicy.minLength)) {
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
  
  sendPassword() {
    this.isLoading = true;
      if (this.resetPwd.valid) {
        this.passwordJson =
        {
          'password': this.password.value
        };
     
      this.resetPasswordService.resetPassword(this.passwordJson).subscribe(
        (response) => {
          this.isLoading = false;
          this.message.success('Contraseña restablecida con éxito');
        },
        (error) => {
          this.isLoading = false;
        }
    );
    } else {
      this.isLoading = false;
    }
  }

  getSecurityPolicies(): void {
      this.securityPolicyService.getSecurityPolicies()
      .subscribe(
        securityPolicy => {
          this.securityPolicy = securityPolicy;
        }
      );
  }

  politicsPassword() {
    this.availablePolitics = ''; // cleaning the message variable
    this.regexExpression = '';

    this.securityPolicyService.getSecurityPolicies()
      .subscribe(
       securityPolicy => {
           this.securityPolicy = securityPolicy;
          console.log(this.securityPolicy);
          
          if (this.securityPolicy.capitalLetter === true)
          {
            this.availablePolitics = 'mayúsculas' + ', ';
            this.regexExpression = '(?=(?:.*[A-Z]))';
          }

          if (this.securityPolicy.lowerCase === true)
          {
            this.availablePolitics = this.availablePolitics + 'minusculas' + ', ' ;
            this.regexExpression = this.regexExpression + '(?=(?:.*[a-z]))';
          }

          if (this.securityPolicy.numericChart === true)
          {
            this.availablePolitics = this.availablePolitics + 'números' + ', ';
            this.regexExpression = this.regexExpression + '(?=(?:.*[0-9]))';
          }

          if (this.securityPolicy.specialChart === true) {
            this.availablePolitics = this.availablePolitics + 'caracteres especiales como #%$' + ', ';
            this.regexExpression = this.regexExpression + '(?=(?:.*[#%$]))';
          }  
          
          if (this.securityPolicy.minLength === 0)
          {
            this.length = 6;
          
            this.availablePolitics = this.availablePolitics + 'contener una longitud de 6 caracteres';
          } else {
            this.availablePolitics = this.availablePolitics + ', ' + 'contener una longitud de ' + this.securityPolicy.minLength + ' caracteres';
            this.length = this.securityPolicy.minLength;
          }
        }
    );
  }
}
