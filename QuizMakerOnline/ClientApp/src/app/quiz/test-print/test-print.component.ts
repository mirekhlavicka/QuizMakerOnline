import { Component, OnInit } from '@angular/core';

import { Question, Answer } from '../../quiz/questionModel';

import { QuestionService } from '../../quiz/question.service';
import { TestService } from '../test.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { globals } from '../../globals';
import { Test } from '../testModel';

//https://medium.com/@Idan_Co/angular-print-service-290651c721f9
@Component({
  selector: 'app-test-print',
  templateUrl: './test-print.component.html',
  styleUrls: ['./test-print.component.css']
})
export class TestPrintComponent implements OnInit {


  constructor(
    private questionService: QuestionService,
    public testService: TestService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) { }

  showSolution: boolean = false;
  showPoints: boolean = true;
  infoBarItems: number = 0;
  public test: Test;

  ngOnInit() {
    this.test = this.testService.currentTest();
    this.showSolution = (this.route.snapshot.paramMap.get('showSolution') == "true");
    this.showPoints = (this.route.snapshot.paramMap.get('showPoints') == "true");
    this.infoBarItems = +this.route.snapshot.paramMap.get('infoBarItems');

    setTimeout(() => { this.print(); }, 500);
  }

  testInfoBarItemsBit(b: number, notlast: boolean = false): boolean {
    return (this.infoBarItems & b) != 0 && (!notlast || this.infoBarItems >= 2 * b);
  }

  print(): void {
    if (!(globals.isTypesetting || globals.typesetNeeded)) {
      window.print();
      this.router.navigate([{ outlets: { print: null } }]);
    } else {
      setTimeout(() => { this.print(); }, 500)
    }
  }
}
