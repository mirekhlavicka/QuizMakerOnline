import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../question.service';
import { Test } from '../testModel';


@Component({
  selector: 'app-question-history',
  templateUrl: './question-history.component.html',
  styleUrls: ['./question-history.component.css']
})
export class QuestionHistoryComponent implements OnInit {

  id_question: number;
  tests: Test[] = [];
  displayedColumns: string[] = ['id_test', 'user_name', 'course', 'semester', 'year', 'group', 'enter_date'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private location: Location
  ) { }

  ngOnInit() {
    this.id_question = +this.route.snapshot.paramMap.get('id_question');

    this.questionService.getHistoryTests(this.id_question).subscribe(t => this.tests = t);

  }

  goBack(): void {
    this.location.back();
  }

  goToDetail(t: Test): void {
    //this.testService.selected_id_test = id_test;
    if (t.canEdit) {
      this.router.navigate([`/test/${t.id_test}`]);
    }
  }
}
