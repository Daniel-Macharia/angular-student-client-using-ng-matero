import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MtxDialog, MtxDialogModule } from '@ng-matero/extensions/dialog';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { MtxSelectModule } from '@ng-matero/extensions/select';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxNativeDatetimeModule } from '@ng-matero/extensions/core';
import { MatDatepickerModule } from '@angular/material/datepicker';

interface StudentData{
  studentId: number,
  firstName: string,
  lastName: string,
  dob: Date,
  class: string,
  score: number,
  passportPhotoUrl: string,
  frontIDPhotoUrl: string,
  backIDPhotoUrl: string
};

@Component({
  selector: 'app-student-list',
  standalone:true,
  imports: [
    CommonModule,
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MtxGridModule,  
    MtxDialogModule,
    MtxSelectModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit{

  private mtxDialog = inject(MtxDialog);
  private formBuilder = inject(FormBuilder);

  @ViewChild('editStudentDialog') editStudentDialog!: TemplateRef<any>;
  @ViewChild('confirmDeleteStudentDialog') confirmDeleteStudentDialog!: TemplateRef<any>;

  @ViewChild('viewStudentDataDialog') viewStudentDataDialog!: TemplateRef<any>;

  studentDataBeingEdited: StudentData|null = null;
  editMode = false;
  classOptions: string[] = [ 'Class 1', 'Class 2', 'Class 3'];

  editStudentForm: FormGroup = this.formBuilder.group({
    studentId: 0,
      firstName: '',
      lastName: '',
      dob: [null],
      class: '',
      score: 0,
      passportPhotoUrl: '',
      frontIDPhotoUrl: '',
      backIDPhotoUrl: ''
  });

  selectedPassportPhoto: File | null = null;
  selectedFrontIDPhoto: File | null = null;
  selectedBackIDPhoto: File | null = null;
  
  previewPassportPhotoUrl: string | ArrayBuffer | null = null;
  previewFrontIDPhotoUrl: string | ArrayBuffer | null = null;
  previewBackIDPhotoUrl: string | ArrayBuffer | null = null;

  columns: MtxGridColumn[] = [
    {header: 'Student Name', field: `firstName`, sortable: true},
    {header: 'D.O.B', field: 'dob', sortable: true, formatter(rowData, colDef) {
      return colDef?.field && rowData[colDef.field].toDateString();
    },},
    {header: 'Class', field: 'class', sortable: true},
    {header: 'Score', field: 'score', sortable: true},
    {header: 'Actions', field: 'action', type: 'button',
      buttons: [
        {text: 'View', icon: 'view', color: 'primary', click: (record: any) => this.onView(record)},
        {text: 'Edit', icon: 'edit', color: 'accent', click: (record: any) => this.onEdit(record)},
        {text: 'Delete', icon: 'delete', color: 'warn', click: (record: any) => this.onDelete(record)}
      ]
    }
  ];

  students:StudentData[] = [
    {
      studentId: 1,
      firstName: 'Daniel',
      lastName: 'Macharia',
      dob: new Date(),
      class: 'Class1',
      score: 89,
      passportPhotoUrl: '',
      frontIDPhotoUrl: '',
      backIDPhotoUrl: ''
    },
    {
      studentId: 2,
      firstName: 'Jackie',
      lastName: 'Chan',
      dob: new Date(),
      class: 'Class2',
      score: 87,
      passportPhotoUrl: '',
      frontIDPhotoUrl: '',
      backIDPhotoUrl: ''
    },
    {
      studentId: 3,
      firstName: 'Kim',
      lastName: 'Possible',
      dob: new Date(),
      class: 'Class3',
      score: 79,
      passportPhotoUrl: '',
      frontIDPhotoUrl: '',
      backIDPhotoUrl: ''
    },
  ];


  ngOnInit(): void {
    this.editStudentForm = this.formBuilder.group({
      studentId: 0,
      firstName: ['', [Validators.required, Validators.name]],
      lastName: ['', [Validators.required, Validators.name]],
      dob: [null],
      class: '',
      score: [0, [Validators.min(0), Validators.max(100)]],
      passportPhotoUrl: '',
      frontIDPhotoUrl: '',
      backIDPhotoUrl: ''
    });

    this.editStudentForm.valueChanges.subscribe( (value: StudentData) => {
      console.log(value);
    });
  }

  get firstName(){
    return this.editStudentForm.get('firstName');
  }

  get lastName(){
    return this.editStudentForm.get('lastName');
  }

  get score(){
    return this.editStudentForm.get('score');
  }

  onAddStudent(){
    console.log('adding student');

    this.editMode = false;

    this.studentDataBeingEdited = {
      studentId: 0,
      firstName: '',
      lastName: '',
      dob: new Date(),
      class: '',
      score: 0,
      passportPhotoUrl: '',
      frontIDPhotoUrl: '',
      backIDPhotoUrl: ''
    };

    this.mtxDialog.originalOpen(this.editStudentDialog, {width: '400px'});
  }

  onView(record: StudentData){
    console.log(`\n\nViewing: \n${record}\n\n`);

    this.studentDataBeingEdited = record;
    this.mtxDialog.originalOpen(this.viewStudentDataDialog, {width: '400px'});
  }

  onEdit(record: StudentData){
    console.log(`\n\nEditing:\n ${record}\n\n`);

    this.editMode = true;
    this.studentDataBeingEdited = record;

    this.mtxDialog.originalOpen(this.editStudentDialog, {width: '400px'});
  }

  saveEditedStudentData(dialogRef: DialogRef)
  {
    console.log(`Saving edited student data`);
    console.log(this.editStudentForm.value);
    dialogRef.close();
  }

  onDelete(record: StudentData){
    console.log(`\n\nDeleting: \n ${record}\n\n`);

    this.studentDataBeingEdited = record;
    this.mtxDialog.originalOpen(this.confirmDeleteStudentDialog, {width: '400px'});
  }

  confirmDeleteStudent(dialogRef: DialogRef)
  {
    console.log(`Confirmed delete of: ${this.studentDataBeingEdited?.firstName}`);
    dialogRef.close();
  }


  onPassportPhotoSelected(event: Event){
    const input = event.target as HTMLInputElement;

    if( input.files && input.files.length > 0 )
    {
      this.selectedPassportPhoto = input.files[0];
      
        if( !this.selectedPassportPhoto?.type.startsWith('image/') )
      {
        alert('only images are allowed!');

        this.selectedPassportPhoto = null;
        this.previewPassportPhotoUrl = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => this.previewPassportPhotoUrl = reader.result;

      reader.readAsDataURL(this.selectedPassportPhoto);
    }
  }

  onFrontIDPhotoSelected(event: Event){
    const input = event.target as HTMLInputElement;

    if( input.files && input.files.length > 0 )
    {
      this.selectedFrontIDPhoto = input.files[0];
      
        if( !this.selectedFrontIDPhoto?.type.startsWith('image/') )
      {
        alert('only images are allowed!');

        this.selectedFrontIDPhoto = null;
        this.previewFrontIDPhotoUrl = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => this.previewFrontIDPhotoUrl = reader.result;

      reader.readAsDataURL(this.selectedFrontIDPhoto);
    }
  }

  onBackIDPhotoSelected(event: Event){
    const input = event.target as HTMLInputElement;

    if( input.files && input.files.length > 0 )
    {
      this.selectedBackIDPhoto = input.files[0];
      
        if( !this.selectedBackIDPhoto?.type.startsWith('image/') )
      {
        alert('only images are allowed!');

        this.selectedBackIDPhoto = null;
        this.previewBackIDPhotoUrl = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => this.previewBackIDPhotoUrl = reader.result;

      reader.readAsDataURL(this.selectedBackIDPhoto);
    }
  }
}
