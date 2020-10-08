/* 
  Path: app/security-policies/components/security-policies.component.ts
  Objective: Define security policies behavior
  Author: Esme López 
*/

import { Component, OnInit } from '@angular/core';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  loading = false;

  constructor(
    private authService: AuthService,
    private securityPolicyService: SecurityPolicyService,
    private notification: NzNotificationService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.securityPolicy = new SecurityPolicy();

    this.setPermissions();
    this.getSecurityPolicies();
  }

  getSecurityPolicies(): void {
    this.loading = true;
    this.securityPolicyService.getSecurityPolicies().subscribe(
      (securityPolicy) => {
        this.securityPolicy = securityPolicy;
        this.loading = false;
      },
      (err) => {
        const statusCode = err.statusCode;
        const notIn = [401, 403];

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.notification.create('error', 'Ocurrió un error al obtener las políticas de seguridad.', err.message, {
            nzDuration: 30000
          });
        }
      }
    );
  }

  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    this.permissions.push(new Permission(1, 'Update'));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);

      p.allow = index == -1 ? false : true;
    });
  }

  showConfirm(): void {
    this.confirmModal = this.modal.confirm({
      nzTitle: '¿Desea actualizar las políticas de seguridad?',
      nzContent: 'La acción no puede deshacerse.',

      nzOnOk: () =>
        this.securityPolicyService
          .updateSecurityPolicies(this.securityPolicy)
          .toPromise()
          .then((securityPolicy) => {
            this.securityPolicy = securityPolicy;
            if (this.securityPolicy.minLength === 0) this.securityPolicy.minActive = false;

            this.message.success('Políticas de seguridad actualizadas con éxito');
          })
          .catch((err) => {
            const statusCode = err.statusCode;
            const notIn = [401, 403];

            if (!notIn.includes(statusCode) && statusCode < 500) {
              this.notification.create(
                'error',
                'Ocurrió un error al actualizar las políticas de seguridad.',
                err.message,
                { nzDuration: 30000 }
              );
            }
          })
    });
  }

  updateMin(): void {
    if (this.securityPolicy.minLength == 0) {
      this.securityPolicy.minLength = 6;
    }

    if (!this.securityPolicy.minActive && this.securityPolicy.minLength != 0) this.securityPolicy.minLength = 0;
  }

  checkPermission(id: number): boolean {
    const index = this.permissions.find((p) => p.id === id);

    return index.allow;
  }
}
