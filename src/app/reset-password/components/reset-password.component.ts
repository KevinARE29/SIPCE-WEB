import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl,  ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../shared/reset-password.service';
import { SecurityPolicy } from '../../security-policies/shared/security-policy.model';
import { ActivatedRoute } from '@angular/router';
import { Politics } from '../politics';
import { Observable, Observer } from 'rxjs';

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
  politics: Politics;
  passwordJson;
  //  message of politics available
  availablePolitics: string;
  regexExpression: string;
  length: number;

  ngOnInit(): void {
    this.resetPwd = this.fb.group({
      password: ['', [Validators.required], [this.politicsAsyncValidator]],
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

  get password() {
    return this.resetPwd.get('password');
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.resetPwd.controls.confirm.updateValueAndValidity());
  }


  politicsAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control && (control.value !== null || control.value !== undefined))
        {
          // validationg if the string has an upper case
          if (this.politics.data.capitalLetter === true) {
            // this.regexExpression
            const regex = new RegExp('(.*[A-Z].*)(.*[a-z].*)(.*\d.*)');
            if (!regex.test(control.value)) {
              // you have to return `{error: true}` to mark it as an error event
              observer.next({ error: true, pattern: true });
            } else {
               observer.next(null);
                   }
        //    observer.complete();
          } 
        }
       observer.complete();
      }, 1000);
    });
  
  
  
  

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
    private router: Router) {
  
     }

  sendPassword() {
    this.isLoading = true;
    // validating the form 
    for (const i in this.resetPwd.controls) {
      this.resetPwd.controls[i].markAsDirty();
      this.resetPwd.controls[i].updateValueAndValidity();
    }
    
    if (this.resetPwd.valid) {
      console.log('variable password');
        console.log(this.password);
        this.passwordJson =
        {
          'password': this.password.value
        };
        console.log(this.passwordJson);
    this.resetPasswordService.resetPassword(this.passwordJson).subscribe(
      (response) => {
      this.isLoading = false;
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
        // this.show = false;
       this.politics = response;
        console.log(this.politics.data);
        if (this.politics.data.capitalLetter === true)
        {
          this.availablePolitics = 'mayúsculas';
          this.regexExpression = '(?=.*[A-Z])';
        }
        if (this.politics.data.lowerCase === true)
        {
          this.availablePolitics = this.availablePolitics + ', ' + 'minusculas';
          this.regexExpression = this.regexExpression + '(?=.*[a-z])';
        }
        if (this.politics.data.numericChart === true)
        {
          this.availablePolitics = this.availablePolitics + ', ' + 'números';
          this.regexExpression = this.regexExpression + '(.*\d.*)';
        }
        if (this.politics.data.specialChart === true) {
          this.availablePolitics = this.availablePolitics + ', ' + 'caracteres especiales como ' + this.politics.data.typeSpecial;
          this.regexExpression = this.regexExpression + '(?=.*\%)(?=.*\$)(?=.*\#)';
        }      
        if (this.politics.data.minLength === 0)
        {
          this.length = 6;
          console.log(this.length);
          this.availablePolitics = this.availablePolitics + ', ' + 'contener una longitud de 6 caracteres';
         } else {
                  this.availablePolitics = this.availablePolitics + ', ' + 'contener una longitud de ' + this.politics.data.minLength + ' caracteres';
                  this.length = this.politics.data.minLength;
        }
        console.log(this.regexExpression);

       }, (error) => {
       
        }
     );
  }
}
