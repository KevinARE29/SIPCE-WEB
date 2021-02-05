import { Component, Input, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Model.
import { InterventionProgram } from 'src/app/expedients/shared/intervention-program.model';
import { InterventionProgramTypes } from './../../../../shared/enums/intervention-program-types.enum';

@Component({
  selector: 'app-intervention-programs-form',
  templateUrl: './intervention-programs-form.component.html',
  styleUrls: ['./intervention-programs-form.component.css']
})
export class InterventionProgramsFormComponent implements OnInit, OnChanges {
  @Input() program: InterventionProgram;
  @Output() formChange = new EventEmitter<FormGroup>();

  programForm: FormGroup;

  // Enum
  programTypes: string[];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.programTypes = Object.values(InterventionProgramTypes).filter((k) => isNaN(Number(k)));
  }

  ngOnChanges(): void {
    this.programForm = this.fb.group({
      name: [this.program ? this.program.name : null, [Validators.required, Validators.maxLength(64)]],
      type: [this.program ? this.program.type : null, [Validators.required]],
      description: [this.program ? this.program.description : null, [Validators.required]],
      status: [this.program ? this.program.status : true]
    });

    this.formChange.emit(this.programForm);
  }
}
