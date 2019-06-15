import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TestService } from '../test.service';
import { QuestionService } from '../question.service';
import { Test } from '../testModel';
import { flatMap } from 'rxjs/operators';
import { Course } from '../questionModel';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  tests: Test[];
  dataSource = null;
  displayedColumns: string[] = ['id_test', 'course', 'semester', 'group', 'year', 'enter_date'];

  @ViewChild(MatPaginator/*, { static: true }*/) paginator: MatPaginator; //!!!!!!

  courses: Course[];
  semesters: Object = {};

  selected_id_test: number = 0;

  constructor(
    private testService: TestService,
    private questionService: QuestionService
  ) { }

  ngOnInit() {

    this.paginator._intl.itemsPerPageLabel = "Počet řádků na stránku";
    this.paginator._intl.getRangeLabel = this.getRangeLabel;
    this.paginator._intl.firstPageLabel = "První stránka";
    this.paginator._intl.nextPageLabel = "Další stránka";
    this.paginator._intl.previousPageLabel = "Předchozí stránka";
    this.paginator._intl.lastPageLabel = "Poslední stránka";

    this.questionService.getCourses().pipe(
      flatMap(c => {
        this.courses = c;
        return this.testService.getSemesters();
      }),
      flatMap(s => {
        this.semesters = s;
        return this.testService.getTests();
      })
    ).subscribe(t => {
      this.tests = t;
      this.dataSource = new MatTableDataSource<Test>(this.tests);
      this.dataSource.paginator = this.paginator;
    })
  }

  getRangeLabel = function (page, pageSize, length) {
    if (length === 0 || pageSize === 0) {
      return '0 z ' + length;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
      Math.min(startIndex + pageSize, length) :
      startIndex + pageSize;
    return startIndex + 1 + ' - ' + endIndex + ' z ' + length;
  };

  courseName(id: number): string {
    return this.courses.find(c => c.id_course == id).name;
  }
}
