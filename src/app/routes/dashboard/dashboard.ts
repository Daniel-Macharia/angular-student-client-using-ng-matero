import { Component } from '@angular/core';
import { PageHeader } from '@shared';
import { StudentList } from 'app/features/student-list/student-list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [PageHeader, StudentList],
})
export class Dashboard {

}
