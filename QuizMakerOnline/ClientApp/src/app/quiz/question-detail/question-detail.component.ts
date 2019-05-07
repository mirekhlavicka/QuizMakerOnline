import { Component, OnInit, Input } from '@angular/core';

import { Question} from '../../quiz/questionModel';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {
  @Input() question: Question;

  @Input() allUsers: Object;
  @Input() questionTypes: Object;
  @Input() questionDifficulties: Object;
  @Input() questionState: Object;

  constructor() { }

  ngOnInit() {
  }

}
