import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SecurityPolicy } from '../shared/security-policy.model';
import { SecurityPolicyService } from '../shared/security-policy.service';

@Component({
  selector: 'app-security-policies',
  templateUrl: './security-policies.component.html',
  styleUrls: ['./security-policies.component.css']
})
export class SecurityPoliciesComponent implements OnInit {
  securityPolicy: SecurityPolicy;

  constructor(
    private router: Router,
    private securityPolicyService: SecurityPolicyService
  ) { }

  ngOnInit(): void {
    this.getSecurityPolicies();
  }

  getSecurityPolicies(): void {
    this.securityPolicyService.getSecurityPolicies()
      .subscribe(
        securityPolicy => {
          this.securityPolicy = securityPolicy;
          console.log('HTTP response', securityPolicy)
        },
        err => {
          console.log('HTTP Error', err);
          // this.router.navigate(['/welcome']);
        },
        () => console.log('HTTP request completed.')
      );
  }
}
