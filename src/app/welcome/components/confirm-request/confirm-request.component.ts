import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NzNotificationService } from 'ng-zorro-antd/notification';

import { WelcomeService } from '../../shared/welcome.service';

@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.component.html',
  styleUrls: ['./confirm-request.component.css']
})
export class ConfirmRequestComponent implements OnInit {
  loading = false;
  confirmationToken: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private welcomeService: WelcomeService,
    private notification: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.route.queryParamMap.subscribe((params) => {
      this.confirmationToken = params['params']['confirmationToken'];
    });

    this.welcomeService.verifyCounselingRequest(this.confirmationToken).subscribe(
      () => {
        this.loading = false;
        this.router.navigate(['/']);

        this.notification.create(
          'success',
          'Consulta de consejería confirmada',
          'La orientadora a cargo revisará la solicitud y se pondrá en contacto contigo.',
          { nzDuration: 30000 }
        );
      },
      (error) => {
        const statusCode = error.statusCode;
        const notIn = [401, 403];

        this.loading = false;

        if (!notIn.includes(statusCode) && statusCode < 500) {
          this.router.navigate(['/']);

          this.notification.create(
            'error',
            'Ocurrió un error al confirmar la consejería. Por favor verifica lo siguiente:',
            error.message,
            { nzDuration: 30000 }
          );
        }
      }
    );
  }
}
