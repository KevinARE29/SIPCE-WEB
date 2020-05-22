/* 
  Path: app/security-policies/components/security-policies.component.ts
  Objetive: Define security policies behavior
  Author: Esme López 
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { SecurityPolicy } from '../shared/security-policy.model';
import { SecurityPolicyService } from '../shared/security-policy.service';

@Component({
  selector: 'app-security-policies',
  templateUrl: './security-policies.component.html',
  styleUrls: ['./security-policies.component.css']
})
export class SecurityPoliciesComponent implements OnInit {
  securityPolicy: SecurityPolicy;
  confirmModal?: NzModalRef;

  constructor(
    private router: Router,
    private securityPolicyService: SecurityPolicyService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.securityPolicy = new SecurityPolicy();
    this.getSecurityPolicies();
  }

  getSecurityPolicies(): void {
    this.securityPolicyService.getSecurityPolicies()
      .subscribe(
        securityPolicy => {
          this.securityPolicy = securityPolicy;
        },
        err => {
          console.log('HTTP Error:', err);
          if(err == 401){
            // this.router.navigate(['/welcome']);
          }
          
        }/*,
        () => console.log('HTTP request completed.')*/
      );
  }

  showConfirm(): void {
    console.log('Confirm');
    this.confirmModal = this.modal.confirm({
      nzTitle: '¿Desea actualizar las políticas de seguridad?',
      nzContent: 'La acción no puede deshacerse.',
      nzOnOk: () =>
      this.securityPolicyService.updateSecurityPolicies(this.securityPolicy)      
        .toPromise().then(securityPolicy => {
          this.securityPolicy = securityPolicy;
          if(this.securityPolicy.minLength == 4)
            this.securityPolicy.minActive = false;
        })
    });
  }

  updateMin(): void {
    if(this.securityPolicy.minLength == 4){
      this.securityPolicy.minLength = 6;
    }
  }
}
