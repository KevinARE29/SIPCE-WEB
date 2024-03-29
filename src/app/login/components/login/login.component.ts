import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  logo: string;
  userLogin: FormGroup;
  errorMessage: boolean;
  btnLoading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.logo = environment.whiteLogo;
  }

  ngOnInit(): void {
    this.userLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onlogin() {
    this.btnLoading = true;
    this.authService.login(this.userLogin.value).subscribe(
      () => {
        this.router.navigate(['inicio']);
        this.btnLoading = false;
      },
      () => {
        this.errorMessage = true;
        this.btnLoading = false;
      }
    );
  }
}
