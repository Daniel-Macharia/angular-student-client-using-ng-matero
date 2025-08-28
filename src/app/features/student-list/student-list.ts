import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MtxDialog, MtxDialogModule } from '@ng-matero/extensions/dialog';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';


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
  imports: [MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MtxGridModule,  
    MtxDialogModule
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList {
  @ViewChild('editStudentDialog') editStudentDialog!: TemplateRef<any>;
  @ViewChild('confirmDeleteStudentDialog') confirmDeleteStudentDialog!: TemplateRef<any>;

  @ViewChild('viewStudentDataDialog') viewStudentDataDialog!: TemplateRef<any>;

  studentDataBeingEdited: StudentData|null = null;
  editMode = false;

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

  private mtxDialog = inject(MtxDialog);

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
}
