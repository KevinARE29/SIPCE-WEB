import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from 'src/app/users/shared/user.service';
import { User } from 'src/app/users/shared/user.model';
import { Catalogs } from '../../shared/catalogs.model';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';

interface ItemData {
  cycle: ShiftPeriodGrade;
  cycleCoordinator: User;
}

@Component({
  selector: 'app-cycle-coordinators',
  templateUrl: './cycle-coordinators.component.html',
  styleUrls: ['./cycle-coordinators.component.css']
})
export class CycleCoordinatorsComponent implements OnInit {
  coordinators: User[];
  cycleCoordinators: string[] = [];
  items: unknown[] = [];

  @Output() academicEvent = new EventEmitter<unknown>();
  @Input() catalogs: Catalogs;
  @Input() assignation: unknown;
  @Input() isActive: boolean; // TODO: Delete if isn't used

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getCycleCoordinators();
  }

  getCycleCoordinators(): void {
    this.userService.getUsersByRole(5).subscribe((data) => {
      this.coordinators = data['data'];
      this.transformData();
    });
  }

  transformData(): void {
    this.catalogs.shifts.forEach((shift) => {
      const currentShift = this.assignation['shifts'].filter((x) => x['shift']['id'] === shift.id);
      const listOfData = new Array<ItemData>();

      Object.entries(currentShift[0]['shift']['cycles']).forEach(([key, value]) => {
        const coordinator = value['cycleCoordinator'];

        listOfData.push({
          cycle: { ...value['cycle'] },
          cycleCoordinator: coordinator ? { ...coordinator } : new User()
        });
      });

      listOfData.sort((a, b) => a['cycle'].id - b['cycle'].id);
      this.items.push({
        shift,
        cycles: listOfData,
        coordinators: { ...this.coordinators },
        filteredOptions: this.coordinators.slice()
      });
    });
  }

  onChange(value: string, shiftId: number, cycle: unknown): void {
    const shift = this.items.find((x) => x['shift'].id === shiftId);

    if (typeof value === 'string') {
      shift['filteredOptions'] = Object.values(shift['coordinators']).filter(
        (option) => option['fullname'].toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else if (typeof value === 'object') {
      shift['coordinators'] = Object.values(shift['coordinators']).filter((x) => x['id'] !== value['id']);
      shift['filteredOptions'] = shift['coordinators'];
    }
  }
}
