/* 
  Path: app/security-policies/components/security-policies.component.ts
  Objetive: Define security policies behavior
  Author: Esme López 
*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NzMessageService } from 'ng-zorro-antd/message';
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
    private message: NzMessageService,
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
          if(err.StatusCode === 401 || err.StatusCode === 403)
            console.log("ERROR");  // TODO: Cambiar por redirección
        }
      );
  }

  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: '¿Desea actualizar las políticas de seguridad?',
      nzContent: 'La acción no puede deshacerse.',
      nzOnOk: () =>
      this.securityPolicyService.updateSecurityPolicies(this.securityPolicy)      
        .toPromise().then(securityPolicy => {
          this.securityPolicy = securityPolicy;
          if(this.securityPolicy.minLength === 0)
            this.securityPolicy.minActive = false;

            this.message.success('Políticas de seguridad actualizadas con éxito');
        }).catch(e => {
          if(e.StatusCode == 401 || e.StatusCode == 403)
            console.log("Error"); // TODO: Cambiar por redirección
          else
            e.message.forEach(element => {
              this.message.error(element);
            });
        })
    });
  }

  updateMin(): void {
    if(this.securityPolicy.minLength == 0){
      this.securityPolicy.minLength = 6;
    }

    if(!this.securityPolicy.minActive && this.securityPolicy.minLength != 0)
      this.securityPolicy.minLength = 0;
  }
  
}
