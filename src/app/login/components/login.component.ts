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
  // jwt: IJwtResponse;
  mostrar: boolean;

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
    console.log(this.userLogin.value);
    this.authService.login(this.userLogin.value).subscribe(
      (response) => {
        this.router.navigate(['/welcome']);
      },
      (error) => {
        console.log(error);
        this.mostrar = true;
        console.log('esto tiene error');
        console.log(error.message);
      }
    );
  }
}
