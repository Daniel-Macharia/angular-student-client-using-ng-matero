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

import { MatDatepickerModule } from '@angular/material/datepicker';
import { StudentClass, StudentData } from '../models/student-models';
import { StudentListService } from '../student-list-service';
import { StudentStatus } from '../enums/student-status';
import { ToastrService } from 'ngx-toastr';

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
    ToastrService
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css'
})
export class StudentList implements OnInit{

  private mtxDialog = inject(MtxDialog);
  private formBuilder = inject(FormBuilder);
  private studentService = inject(StudentListService);
  private toastr = inject(ToastrService);

  @ViewChild('editStudentDialog') editStudentDialog!: TemplateRef<any>;
  @ViewChild('confirmDeleteStudentDialog') confirmDeleteStudentDialog!: TemplateRef<any>;

  @ViewChild('viewStudentDataDialog') viewStudentDataDialog!: TemplateRef<any>;

  studentDataBeingEdited: StudentData = {
      studentId: 0,
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      studentClass: {name: '', definition: ''},
      studentStatus: StudentStatus.DELETED,
      score: 0,
      studentPassportPhoto: '',
      studentIDFrontPhoto: '',
      studentIDBackPhoto: ''
    };
  editMode = false;

  classOptions: StudentClass[] = [];

  editStudentForm: FormGroup = this.formBuilder.group({
    studentId: 0,
      firstName: '',
      lastName: '',
      dateOfBirth: [null],
      class: null,
      score: null,
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
    {header: 'D.O.B', field: 'dateOfBirth', sortable: true, formatter(rowData) {
      return new Date(rowData.dateOfBirth).toLocaleDateString();
    },},
    {header: 'Class', field: 'studentClass', sortable: true, formatter(rowData) {
      return rowData.studentClass;
    },},
    {header: 'Status', field: 'studentStatus', sortable: true},
    {header: 'Score', field: 'score', sortable: true},
    {header: 'Actions', field: 'action', type: 'button',
      buttons: [
        {text: 'View', icon: 'view', color: 'primary', click: (record: any) => this.onView(record)},
        {text: 'Edit', icon: 'edit', color: 'accent', click: (record: any) => this.onEdit(record)},
        {text: 'Delete', icon: 'delete', color: 'warn', click: (record: any) => this.onDelete(record)}
      ]
    }
  ];

  students:StudentData[] = [];


  ngOnInit(): void {
    console.log('initializing component');
    // this.editStudentForm = this.formBuilder.group({
    //   studentId: 0,
    //   firstName: ['', [Validators.required, Validators.name]],
    //   lastName: ['', [Validators.required, Validators.name]],
    //   dateOfBirth: [null],
    //   class: '',
    //   score: [0, [Validators.min(0), Validators.max(100)]],
    //   passportPhotoUrl: '',
    //   frontIDPhotoUrl: '',
    //   backIDPhotoUrl: ''
    // });

    this.editStudentForm.valueChanges.subscribe( (value: StudentData) => {
      console.log(value);
    });

    this.studentService.getAllStudents().subscribe((data) => {
      this.students = data;
      console.log(data);
    });

    this.studentService.getClassOptions()
    .subscribe( (data) => {
      this.classOptions = data;

      console.log(data);
      console.log(this.classOptions);
    });

    console.log('finished initializing component');
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
      dateOfBirth: new Date(),
      studentClass: {name: '', definition: ''},
      studentStatus: StudentStatus.DELETED,
      score: 0,
      studentPassportPhoto: '',
      studentIDFrontPhoto: '',
      studentIDBackPhoto: ''
    };

    this.editStudentForm = this.formBuilder.group({
      firstName: null,
      lastName: null,
      score: null,
      studentClass: null,
      studentStatus: null,
      dateOfBirth: null,
      studentId: null,
      studentPassportPhoto: null,
      studentIDFrontPhoto: null, 
      studentIDBackPhoto: null
    });
    
    this.mtxDialog.originalOpen(this.editStudentDialog, {width: '400px'});
  }

  onView(record: StudentData){
    console.log(`Viewing: `, record);
    this.studentDataBeingEdited.firstName = record.firstName;
    this.studentDataBeingEdited.lastName = record.lastName;
    this.studentDataBeingEdited.dateOfBirth = record.dateOfBirth;
    this.studentDataBeingEdited.score = record.score;
    this.studentDataBeingEdited.studentClass = record.studentClass;
    this.studentDataBeingEdited.studentStatus = record.studentStatus;

    this.studentDataBeingEdited.studentPassportPhoto = record.studentPassportPhoto;
    this.studentDataBeingEdited.studentIDFrontPhoto = record.studentIDFrontPhoto;
    this.studentDataBeingEdited.studentIDBackPhoto = record.studentIDBackPhoto;

    console.log(`Current: `, this.studentDataBeingEdited);

    this.mtxDialog.originalOpen(this.viewStudentDataDialog, {width: '400px'});
  }

  onEdit(record: StudentData){
    console.log(`\n\nEditing:\n ${record}\n\n`);

    this.editMode = true;
    this.studentDataBeingEdited = record;
    this.editStudentForm = this.formBuilder.group({
      firstName: this.studentDataBeingEdited.firstName,
      lastName: this.studentDataBeingEdited.lastName,
      score: this.studentDataBeingEdited.score,
      studentClass: this.studentDataBeingEdited.studentClass,
      studentStatus: this.studentDataBeingEdited.studentStatus,
      dateOfBirth: this.studentDataBeingEdited.dateOfBirth,
      studentId: this.studentDataBeingEdited.studentId,
      studentPassportPhoto: null,//this.studentDataBeingEdited.studentPassportPhoto,
      studentIDFrontPhoto: null, //this.studentDataBeingEdited.studentIDFrontPhoto,
      studentIDBackPhoto: null//this.studentDataBeingEdited.studentIDBackPhoto,
    });

    this.toastr.info(`ID: ${this.studentDataBeingEdited.studentId}`);

    this.mtxDialog.originalOpen(this.editStudentDialog, {width: '400px'});
  }

  saveEditedStudentData(dialogRef: DialogRef)
  {
    console.log(`Saving edited student data`);
    console.log(this.editStudentForm.value);

    if( this.editStudentForm.value !== null )
    {
      if( this.selectedPassportPhoto === null )
      {
        this.toastr.info('passport photo is required. Please upload');
        return;
      }

      if( this.selectedFrontIDPhoto === null )
      {
        this.toastr.info('ID front photo is required. Please upload');
        return;
      }

      if( this.selectedBackIDPhoto === null )
      {
        this.toastr.info('ID back photo is required. Please upload');
        return;
      }

      if( !this.editMode )
      {
        this.studentService.createStudent({
        studentId: 0,
        firstName: this.editStudentForm.value['firstName'],//this.studentDataBeingEdited.firstName,
        lastName: this.editStudentForm.value['lastName'],//this.studentDataBeingEdited.lastName,
        dateOfBirth: this.editStudentForm.value['dateOfBirth'],//this.studentDataBeingEdited.dateOfBirth,
        studentClass: this.editStudentForm.value['studentClass'],//this.studentDataBeingEdited.class,
        studentStatus: StudentStatus.ACTIVE,
        score: this.editStudentForm.value['score'],//this.studentDataBeingEdited.score,
        passportPhotoUrl: this.selectedPassportPhoto,
        frontIDPhotoUrl: this.selectedFrontIDPhoto,
        backIDPhotoUrl: this.selectedBackIDPhoto
      }).subscribe({
        next: (data) => this.toastr.success(data), 
        error: (error) => {this.toastr.error(error);}
      });
      }
      else{
        this.studentService.editStudent({
        studentId: this.editStudentForm.value['studentId'],
        firstName: this.editStudentForm.value['firstName'],
        lastName: this.editStudentForm.value['lastName'],
        dateOfBirth: this.editStudentForm.value['dateOfBirth'],
        studentClass: this.editStudentForm.value['studentClass'],
        studentStatus: this.editStudentForm.value['studentStatus'],
        score: this.editStudentForm.value['score'],
        passportPhotoUrl: this.selectedPassportPhoto,
        frontIDPhotoUrl: this.selectedFrontIDPhoto,
        backIDPhotoUrl: this.selectedBackIDPhoto
        }).subscribe({
          next: (data) => this.toastr.success(data),
          error: (error) => this.toastr.error(error)
        });
      }

      

      dialogRef.close();
    }
    else{
      this.toastr.info('complete filling the form before submitting');
    }
  }

  onDelete(record: StudentData){
    console.log(`\n\nDeleting: \n ${record}\n\n`);

    this.studentDataBeingEdited = record;
    this.mtxDialog.originalOpen(this.confirmDeleteStudentDialog, {width: '400px'});
  }

  confirmDeleteStudent(dialogRef: DialogRef)
  {
    this.toastr.warning(`Confirmed delete of: ${this.studentDataBeingEdited?.firstName}\nID: ${this.studentDataBeingEdited?.studentId}`);

    this.studentService.deleteStudent(this.studentDataBeingEdited?.studentId)
    .subscribe({
      next: (data) => this.toastr.info(data.toString()),
      error: (error) => this.toastr.error(error)
    });

    dialogRef.close();
  }


  onPassportPhotoSelected(event: Event){
    const input = event.target as HTMLInputElement;

    if( input.files && input.files.length > 0 )
    {
      this.selectedPassportPhoto = input.files[0];
      
        if( !this.selectedPassportPhoto?.type.startsWith('image/') )
      {
        this.toastr.error('only images are allowed!');

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
        this.toastr.error('only images are allowed!');

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
        this.toastr.error('only images are allowed!');

        this.selectedBackIDPhoto = null;
        this.previewBackIDPhotoUrl = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = () => this.previewBackIDPhotoUrl = reader.result;

      reader.readAsDataURL(this.selectedBackIDPhoto);
    }
  }

  onRefreshStudentList()
  {
    this.studentService.getAllStudents().subscribe((data) => {
      this.students = data;
      console.log(data);
    });
  }
}
