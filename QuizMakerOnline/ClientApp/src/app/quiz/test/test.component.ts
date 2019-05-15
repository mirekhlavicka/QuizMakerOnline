import { Component, OnInit } from '@angular/core';

import { Question, Answer } from '../../quiz/questionModel';

import { QuestionService } from '../../quiz/question.service';
import { TestService } from '../test.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(
    private questionService: QuestionService,
    public testService: TestService,
    private location: Location) { }

  showSolution: boolean = false;

  ngOnInit() {
  }

  removeFromTest(q: Question) {
    this.testService.del(q);
  }

  goBack(): void {
    this.location.back();
  }
}
