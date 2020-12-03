import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Permission } from 'src/app/shared/permission.model';
import { History } from '../../shared/history.model';
import { HistoryService } from '../../shared/history.service';
import { AuthService } from 'src/app/login/shared/auth.service';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.css']
})
export class HistoryDetailComponent implements OnInit {
  // Params.
  studentId: number;

  // History
  loadingHistory = false;
  histories: History[];
  selectedHistory: History;
  selectedHistoryIndex: number;
  selectedHistoryIsFirst: boolean;
  selectedHistoryIsLast: boolean;
  selectedHistoryIsActive: boolean;

  // History permissions.
  permissions: Permission[] = [];
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private historyService: HistoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const paramStudent = this.route.snapshot.params['studentId'];
    if (typeof paramStudent === 'string' && !Number.isNaN(Number(paramStudent))) {
      this.studentId = Number(paramStudent);
    }

    this.setPermissions();
    this.getHistories();
  }

  /* ------      Control page permissions      ------ */
  setPermissions(): void {
    const token = this.authService.getToken();
    const content = this.authService.jwtDecoder(token);

    const permissions = content.permissions;

    // To check if current user is the author of a history.
    this.userId = content.id;

    this.permissions.push(new Permission(31, ''));
    this.permissions.push(new Permission(46, ''));

    // Annotation permissions
    this.permissions.push(new Permission(44, ''));
    this.permissions.push(new Permission(36, ''));
    this.permissions.push(new Permission(37, ''));
    this.permissions.push(new Permission(38, ''));

    this.permissions.forEach((p) => {
      const index = permissions.indexOf(p.id);
      p.allow = index == -1 ? false : true;
    });
  }

  checkPermission(id: number): boolean {
    if (this.permissions) {
      const index = this.permissions.find((p) => p.id === id);
      return index.allow;
    }

    return false;
  }

  getHistories(): void {
    this.loadingHistory = true;
    this.historyService.getStudentHistory(this.studentId).subscribe((r) => {
      this.histories = r.sort((a, b) => b.behavioralHistoryYear - a.behavioralHistoryYear);
      this.setHistory(0);
      this.loadingHistory = false;
    });
  }

  setHistory(index: number): void {
    if (index >= 0 && index < this.histories.length) {
      this.selectedHistory = this.histories[index];
      this.selectedHistoryIndex = index;
      this.selectedHistoryIsActive = index === 0;
      this.selectedHistoryIsFirst = index === 0;
      this.selectedHistoryIsLast = index === this.histories.length - 1;
    }
  }
}
