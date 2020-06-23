import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl,  ValidationErrors, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../../../reset-password/shared/reset-password.service';
import { SecurityPolicy } from '../../../security-policies/shared/security-policy.model';
import { Politics } from '../../../reset-password/politics';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-upgrade-password',
  templateUrl: './upgrade-password.component.html',
  styleUrls: ['./upgrade-password.component.css']
})
export class UpgradePasswordComponent implements OnInit {
  resetPwd: FormGroup;
  securityPolicy: SecurityPolicy;
  isLoading = false;
  politics: Politics;
  passwordJson; // variable that contains a validated password 
  availablePolitics: string; // string that contains the message of the politics that are available
  regexExpression: string; // dinamic regex expression formed according the available politics
  length: number; // minlegth for a passwprd
  str: string; //substring used in the method lengthAsyncValidator

  constructor(private fb: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private router: Router,
    private message: NzMessageService) { }

  ngOnInit(): void {
    this.resetPwd = this.fb.group({
      oldPassword: ['', [Validators.required]],
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

  get oldPassword() {
    return this.resetPwd.get('oldPassword');
  }

  get password() {
    return this.resetPwd.get('password');
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.resetPwd.controls.confirm.updateValueAndValidity() );
  }


  politicsAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control && (control.value !== null || control.value !== undefined))
        {
          // validationg the password with the available politics
            const regex = new RegExp(this.regexExpression);
          if (!regex.test(control.value)) {
            observer.next({ error: true, expression: true });
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
          if (this.politics.data.minLength === 0) {
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
            if ((this.str.length === this.politics.data.minLength) || (this.str.length > this.politics.data.minLength)) {
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
          'oldPassword': this.password.value,
          'newPassword': this.oldPassword.value
        };
     
      this.resetPasswordService.updatePassword(this.passwordJson).subscribe(
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
 
  politicsPassword() {
    this.availablePolitics = ''; // cleaning the message variable
    this.resetPasswordService.getPolitics().subscribe(
        (response) => {
       this.politics = response;

        if (this.politics.data.capitalLetter === true)
        {
          this.availablePolitics = 'mayúsculas';
          this.regexExpression = '(?=(?:.*[A-Z]))';
        }
        if (this.politics.data.lowerCase === true)
        {
          this.availablePolitics = this.availablePolitics + ', ' + 'minusculas';
          this.regexExpression = this.regexExpression + '(?=(?:.*[a-z]))';
        }
        if (this.politics.data.numericChart === true)
        {
          this.availablePolitics = this.availablePolitics + ', ' + 'números';
          this.regexExpression = this.regexExpression + '(?=(?:.*[0-9]))';
        }
        if (this.politics.data.specialChart === true) {
          this.availablePolitics = this.availablePolitics + ', ' + 'caracteres especiales como ' + this.politics.data.typeSpecial;
          this.regexExpression = this.regexExpression + '(?=(?:.*[#%$]))';
        }      
        if (this.politics.data.minLength === 0)
        {
          this.length = 6;
         
          this.availablePolitics = this.availablePolitics + ', ' + 'contener una longitud de 6 caracteres';
         } else {
                  this.availablePolitics = this.availablePolitics + ', ' + 'contener una longitud de ' + this.politics.data.minLength + ' caracteres';
                  this.length = this.politics.data.minLength;
                 }
       
        }
      );
  }
}
