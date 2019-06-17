import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { QuestionService } from '../question.service';
import { TestService } from '../test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from '../testModel';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {

  id_test: number;
  test: Test;

  showSolution: boolean = false;
  showPoints: boolean = true;

  constructor(private questionService: QuestionService,
    public testService: TestService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.getTest();
  }

  getTest(): void {
    this.id_test = +this.route.snapshot.paramMap.get('id');
    this.testService.getTest(this.id_test).subscribe(test => this.test = test);
  }

  goBack(): void {
    this.location.back();
  }
}
