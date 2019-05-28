import { Component, OnInit } from '@angular/core';

import { Question, Answer } from '../../quiz/questionModel';

import { QuestionService } from '../../quiz/question.service';
import { TestService } from '../test.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private questionService: QuestionService,
    public testService: TestService,
    private location: Location,
    private router: Router) { }

  showSolution: boolean = false;
  showPoints: boolean = true;

  ngOnInit() {
  }

  removeFromTest(q: Question) {
    this.testService.del(q);
  }

  moveUp(q: Question) {
    this.testService.moveUp(q);
  }

  moveDown(q: Question) {
    this.testService.moveDown(q);
  }

  goBack(): void {
    this.location.back();
  }

  print(): void {
    this.router.navigate(['/',
      {
        outlets: {
          'print': ['printtest', { showSolution: this.showSolution, showPoints: this.showPoints }]
        }
      }], { skipLocationChange: true });
  }

  //download(): void {
  //  this.location.go("/api/tests/download");
  //}
}
