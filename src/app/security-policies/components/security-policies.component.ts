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

  showConfirm(): void {
    console.log('Confirm');
    this.confirmModal = this.modal.confirm({
      nzTitle: '¿Desea actualizar las políticas de seguridad?',
      nzContent: 'La acción no puede deshacerse.',
      nzOnOk: () =>
        new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
        }).catch(() => console.log('Oops errors!'))
    });
  }
}
