import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/users/shared/user.service';
import { User } from 'src/app/users/shared/user.model';

@Component({
  selector: 'app-cycle-coordinators',
  templateUrl: './cycle-coordinators.component.html',
  styleUrls: ['./cycle-coordinators.component.css']
})
export class CycleCoordinatorsComponent implements OnInit {
  coordinators: User[];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getCycleCoordinators();
  }

  getCycleCoordinators(): void {
    this.userService.getUsersByRole(5).subscribe((data) => {
      console.log(data);
    });
  }
}
