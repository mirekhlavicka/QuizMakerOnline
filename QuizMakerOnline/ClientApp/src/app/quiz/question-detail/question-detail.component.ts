import { Component, OnInit, Input } from '@angular/core';

import { Question, Answer, RelatedLists } from '../../quiz/questionModel';

import { MatDialog, MatDialogRef } from '@angular/material';
import { MathjaxEditComponent } from '../mathjax-edit/mathjax-edit.component';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.css']
})
export class QuestionDetailComponent implements OnInit {
  @Input() question: Question;

  //@Input() allUsers: Object;
  //@Input() questionTypes: Object;
  //@Input() questionDifficulties: Object;
  //@Input() questionState: Object;
  @Input() relatedLists: RelatedLists;

  constructor(
    public dialog: MatDialog,
    private questionService: QuestionService) { }

  ngOnInit() {
  }

  editQuestion(solution: boolean): void {
    const dialogRef = this.dialog.open(MathjaxEditComponent, {
      width: '70%',
      //minHeight: '500px',
      //height: '80%',
      data: {
        type: solution ? 2 : 1,
        text: solution ? this.question.solution : this.question.question,
        points: this.question.points,
        id_category: this.question.id_category,
        id_user: this.question.id_user,
        id_question_type: this.question.id_question_type,
        id_question_difficulty: this.question.id_question_difficulty,
        right_answer: this.question.right_answer,
        state: this.question.state,
        relatedLists: this.relatedLists
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      if (result != null) {
        if (solution) {
          this.question.solution = result.text;
        } else {
          this.question.question = result.text;
          this.question.points = result.points;
          this.question.id_question_difficulty = result.id_question_difficulty;
        }
        this.questionService.updateQuestion(this.question).subscribe(_ => { alert("otazka ulozena") });
      }
    });
  }

  editAnswer(answer: Answer): void {
    const dialogRef = this.dialog.open(MathjaxEditComponent, {
      width: '70%',
      data: {
        type: 3,
        text: answer.answer,
        points: answer.points,
        relatedLists: this.relatedLists
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        answer.answer = result.text;
        answer.points = result.points;
        this.questionService.updateAnswer(answer).subscribe(_ => { alert("podotazka ulozena") });
      }
    });
  }

}
