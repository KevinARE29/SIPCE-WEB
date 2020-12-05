import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';

import { SessionService } from 'src/app/expedients/shared/session.service';
import { StudentWithSession } from 'src/app/expedients/shared/student-with-session.model';

@Component({
  selector: 'app-export-resposibles-interview',
  templateUrl: './export-resposibles-interview.component.html',
  styleUrls: ['./export-resposibles-interview.component.css']
})
export class ExportResposiblesInterviewComponent implements OnInit {
  // Param.
  studentId: number;
  expedientId: number;
  sessionId: number;

  // Data.
  loadingData: boolean;
  data: StudentWithSession;
  sessionStartDate: string;
  sessionEndDate: Date;

  constructor(private route: ActivatedRoute, private router: Router, private sessionService: SessionService) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) {
      this.router.navigate(['/login/error403']);
    }

    const paramStudent = this.route.snapshot.params['student'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    const paramExpedient = this.route.snapshot.params['expedient'];
    if (typeof paramExpedient === 'string' && !Number.isNaN(Number(paramExpedient))) {
      this.expedientId = Number(paramExpedient);
    }

    const paramSession = this.route.snapshot.params['session'];
    if (typeof paramSession === 'string' && !Number.isNaN(Number(paramSession))) {
      this.sessionId = Number(paramSession);
    }

    this.loadingData = true;
    this.sessionService.exportSession(this.expedientId, this.studentId, this.sessionId, token).subscribe((data) => {
      this.data = data;

      this.sessionStartDate = format(new Date(this.data.session.startedAt), 'd/MMMM/yyyy', { locale: es });
      this.sessionEndDate = addMinutes(new Date(this.data.session.startHour), this.data.session.duration);

      this.loadingData = false;
    });
  }
}
