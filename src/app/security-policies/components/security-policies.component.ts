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
import { AuthService } from '../../login/shared/auth.service';
import { Permission } from '../../shared/permission.model';

@Component({
  selector: 'app-security-policies',
  templateUrl: './security-policies.component.html',
  styleUrls: ['./security-policies.component.css']
})
export class SecurityPoliciesComponent implements OnInit {
  securityPolicy: SecurityPolicy;
  confirmModal?: NzModalRef;
  permissions: Array<Permission> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private securityPolicyService: SecurityPolicyService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.setPermissions();
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

  setPermissions(){
    let token = this.authService.getToken();
    let content = this.authService.jwtDecoder(token);

    let permissions = content.permissions;

    this.permissions.push(new Permission(1, "Update"));

    this.permissions.forEach(p => {
      let index = permissions.indexOf(p.id);
      
      p.allow = (index == -1)? false : true;
    });
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
  
  checkPermission(id: number){
    let index = this.permissions.find( p => p.id === id);
      
    return index.allow;
  }

}
