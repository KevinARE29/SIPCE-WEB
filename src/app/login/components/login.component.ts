import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  userLogin: FormGroup;
  errorMessage: boolean;
  btnLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onlogin() {
    this.btnLoading = true;
    this.authService.login(this.userLogin.value).subscribe(
      (response) => {
        this.router.navigate(['welcome']);
        this.btnLoading = false;
      },
      (error) => {
        this.errorMessage = true;
        this.btnLoading = false;
      }
    );
  }
}
