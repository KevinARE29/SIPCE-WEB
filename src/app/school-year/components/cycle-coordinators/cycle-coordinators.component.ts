import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from 'src/app/users/shared/user.service';
import { User } from 'src/app/users/shared/user.model';
import { Catalogs } from '../../shared/catalogs.model';
import { ShiftPeriodGrade } from 'src/app/manage-academic-catalogs/shared/shiftPeriodGrade.model';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ItemData {
  cycle: ShiftPeriodGrade;
  cycleCoordinator: User;
  error: string;
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

  constructor(private userService: UserService, private message: NzMessageService) {}

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
          cycleCoordinator: coordinator ? { ...coordinator } : '',
          error: null
        });
      });

      listOfData.sort((a, b) => a['cycle'].id - b['cycle'].id);

      const item = {
        shift,
        cycles: listOfData,
        coordinators: this.coordinators.map((coordinator) => {
          return { ...coordinator };
        })
      };

      item['filteredOptions'] = item.coordinators;

      this.items.push(item);
    });
  }

  onBlur(cycle: unknown, item: unknown): void {
    if (typeof cycle['cycleCoordinator'] === 'string') {
      cycle['error'] = 'No se encontró un coordinador de ciclo con ese nombre';
    } else if (typeof cycle['cycleCoordinator'] === 'object') {
      cycle['cycleCoordinator'].active = false;
      document.getElementById(item['shift']['id'] + '_' + cycle['cycle']['id']).setAttribute('disabled', 'true');
    }

    item['filteredOptions'] = item['coordinators'];
  }

  onChange(value: string, item: unknown): void {
    if (typeof value === 'string') {
      item['filteredOptions'] = item['coordinators'].filter((coordinator) => {
        return coordinator['fullname'].toLowerCase().includes(value.toLowerCase());
      });
    }
  }

  cleanCoordinator(cycle: unknown, item: unknown): void {
    if (typeof cycle['cycleCoordinator'] === 'object') {
      cycle['cycleCoordinator'].active = true;
      cycle['cycleCoordinator'] = '';

      document.getElementById(item['shift']['id'] + '_' + cycle['cycle']['id']).removeAttribute('disabled');
    } else if (typeof cycle['cycleCoordinator'] === 'string') {
      cycle['cycleCoordinator'] = '';
      cycle['error'] = null;
    }
  }
}
