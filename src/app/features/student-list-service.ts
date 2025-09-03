import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateStudentData, StudentData } from './models/student-models';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'app/new-login/local-storage-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StudentListService {
  private apiUrl = 'http://localhost:8080/api/v1/student';

  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  getJwt(): string
  {
    return this.localStorageService.getFromLocalStorage('jwt') ?? '';
  }

  createStudent(studentData: CreateStudentData): Observable<any> {

    console.log('Received student data in service');
    console.log(studentData);
    const formData = new FormData();

    formData.append( 'firstName', studentData.firstName);
    formData.append( 'lastName', studentData.lastName);
    formData.append( 'score', String(studentData.score));
    formData.append( 'dateOfBirth', String(studentData.dateOfBirth));
    formData.append( 'studentClass', String(studentData.studentClass));
    formData.append( 'studentStatus', 'ACTIVE');
    
    formData.append( 'studentPassportPhoto', studentData.passportPhotoUrl);
    formData.append( 'studentIDFrontPhoto', studentData.frontIDPhotoUrl);
    formData.append( 'studentIDBackPhoto', studentData.backIDPhotoUrl);

    console.log('after setting data in service', studentData);

    return this.http.post(`${this.apiUrl}/create`, formData, {
      headers: new HttpHeaders({
      Authorization: `Bearer ${this.getJwt()}`
    })
    });
  }

  editStudent(studentData: CreateStudentData): Observable<any> {

    console.log('Received student data in service');
    console.log(studentData);
    const formData = new FormData();

    formData.append('studentId', String(studentData.studentId));

    formData.append( 'firstName', studentData.firstName);
    formData.append( 'lastName', studentData.lastName);
    formData.append( 'score', String(studentData.score));
    formData.append( 'dateOfBirth', new Date(studentData.dateOfBirth).toDateString());
    formData.append( 'studentClass', String(studentData.studentClass));
    formData.append( 'studentStatus', studentData.studentStatus);
    
    formData.append( 'studentPassportPhoto', studentData.passportPhotoUrl);
    formData.append( 'studentIDFrontPhoto', studentData.frontIDPhotoUrl);
    formData.append( 'studentIDBackPhoto', studentData.backIDPhotoUrl);

    console.log('after setting data in service', studentData);

    return this.http.post(`${this.apiUrl}/update`, formData, 
      {
        headers: new HttpHeaders({
        Authorization: `Bearer ${this.getJwt()}`
      })
    });
  }


  getAllStudents():Observable<any> {
    
    console.log(this.getJwt());
    return this.http.get(`${this.apiUrl}/get`, {headers: 
      new HttpHeaders({
      Authorization: `Bearer ${this.getJwt()}`
    })
    });
  }

  getClassOptions():Observable<any>{
    
    return this.http.get(`${this.apiUrl}/classes`, 
      {
        headers: new HttpHeaders({
        Authorization: `Bearer ${this.getJwt()}`
      })}
    );
  }


  deleteStudent(id: number)
  {
    
    return this.http.delete(`${this.apiUrl}/delete/${id}`, 
      {
        headers: new HttpHeaders({
        Authorization: `Bearer ${this.getJwt()}`
      })}
    );
  }
}
