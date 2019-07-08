import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TestService } from '../test.service';
import { QuestionService } from '../question.service';
import { Test } from '../testModel';
import { flatMap } from 'rxjs/operators';
import { Course } from '../questionModel';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  objectKeys = Object.keys;

  tests: Test[];
  dataSource = null;
  displayedColumns: string[] = ['id_test', 'course', 'semester', 'year', 'group', 'enter_date'];

  @ViewChild(MatPaginator/*, { static: true }*/) paginator: MatPaginator; //!!!!!!

  courses: Object = {};
  semesters: Object = {};

  filter_id_course: number = 0;

  constructor(
    private testService: TestService,
    private questionService: QuestionService,
    private router: Router
  ) { }

  ngOnInit() {

    if (this.testService.currentTestId() != -1) {
      this.goToDetail(this.testService.currentTestId());
      return;
    }

    this.paginator._intl.itemsPerPageLabel = "Počet řádků na stránku";
    this.paginator._intl.getRangeLabel = this.getRangeLabel;
    this.paginator._intl.firstPageLabel = "První stránka";
    this.paginator._intl.nextPageLabel = "Další stránka";
    this.paginator._intl.previousPageLabel = "Předchozí stránka";
    this.paginator._intl.lastPageLabel = "Poslední stránka";

    this.testService.getMyCourses().pipe(
      flatMap(c => {
        this.courses = c;
        return this.testService.getSemesters();
      }),
      flatMap(s => {
        this.semesters = s;
        return this.testService.getTests();
      })
    ).subscribe(t => {

      if (this.testService.last_pageIndex != 0) {
        this.paginator.pageIndex = this.testService.last_pageIndex;
      }

      if (this.testService.last_pageSize != 0) {
        this.paginator.pageSize = this.testService.last_pageSize;
      }

      if (this.testService.last_filter_id_course != 0) {
        this.filter_id_course = this.testService.last_filter_id_course;
      }

      this.tests = t;
      this.dataSource = new MatTableDataSource<Test>(this.tests);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filterPredicate = (data: Test, filter: string) => {
        if (filter != null && filter != "") {
          return data.id_course == +filter;
        } else {
          return true;
        }
      };

      if (this.filter_id_course != 0) {
        this.dataSource.filter = this.filter_id_course.toString();
      }
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue;
    this.testService.last_filter_id_course = (filterValue && filterValue != "" ? +filterValue : 0);
  }

  pageChanged(e: PageEvent): void {
    this.testService.last_pageIndex = e.pageIndex;
    this.testService.last_pageSize = e.pageSize;
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

  //courseName(id: number): string {
  //  return this.courses.find(c => c.id_course == id).name;
  //}

  goToDetail(id_test: number): void {
    //this.testService.selected_id_test = id_test;
    this.router.navigate([`/test/${id_test}`]);
  }

  sortedObjectKeys(o: Object): string[] {
      return Object.keys(o).sort(function (a, b) { return o[a] > o[b] ? 1 : -1 })
  }

}
