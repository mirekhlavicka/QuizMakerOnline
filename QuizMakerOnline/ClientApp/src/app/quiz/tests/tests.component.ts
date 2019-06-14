import { Component, OnInit } from '@angular/core';
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

  courses: Course[];

  selected_id_test: number = 0;

  constructor(
    private testService: TestService,
    private questionService: QuestionService
  ) { }

  ngOnInit() {

    this.questionService.getCourses().pipe(
      flatMap(c => {
        this.courses = c;
        return this.testService.getTests();
      })).subscribe(t => this.tests = t)
  }

  courseName(id: number): string {
    return this.courses.find(c => c.id_course == id).name;
  }
}
