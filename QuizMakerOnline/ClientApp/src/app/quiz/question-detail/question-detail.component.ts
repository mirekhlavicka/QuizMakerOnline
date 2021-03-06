import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Question, Answer, RelatedLists } from '../../quiz/questionModel';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MathjaxEditComponent } from '../mathjax-edit/mathjax-edit.component';
import { QuestionService } from '../question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionsComponent } from '../questions/questions.component';

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

  @Output() deleted = new EventEmitter<number>();

  goto_id_question: string = "";

  constructor(
    public dialog: MatDialog,
    private questionService: QuestionService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public questionsComponent: QuestionsComponent
  ) { }

  ngOnInit() {
  }

  editQuestion(solution: boolean): void {
    this.questionsComponent.changeDirection = 0;
    const dialogRef = this.dialog.open(MathjaxEditComponent, {
      maxWidth: '1550px',
      width: '98%',
      //minHeight: '500px',
      //height: '80%',
      data: {
        type: solution ? 2 : 1,
        text: solution ? this.question.solution : this.question.question,
        points: this.question.id_question_type == 3 ? this.question.answers.reduce((sum, current) => sum + current.points, 0) : this.question.points, //this.question.points
        id_category: this.question.id_category,
        id_user: this.question.id_user,
        id_question_type: this.question.id_question_type,
        id_question_difficulty: this.question.id_question_difficulty,
        right_answer: this.question.right_answer,
        state: this.question.state,
        relatedLists: this.relatedLists,
        question: this.question,
        newitem: this.question.id_question == 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      if (result != null) {
        if (solution) {
          this.question.solution = result.text;
          this.question.right_answer = result.right_answer;
        } else {
          this.question.question = result.text;
          this.question.points = result.points;
          this.question.id_question_difficulty = result.id_question_difficulty;
          this.question.id_category = result.id_category;
          this.question.id_question_type = result.id_question_type;
          this.question.state = result.state;
          this.question.right_answer = result.right_answer;
        }
        if (this.question.id_question == 0) {
          this.questionService.addQuestion(this.question).subscribe(q => {
            this.question.id_question = q.id_question;
            this.question.id_user = q.id_user;
            this.question.enter_date = q.enter_date;
            this._snackBar.open("Otázka byla přidána", null, { duration: 3000 })
          });
        } else {
          this.questionService.updateQuestion(this.question).subscribe(_ => { this._snackBar.open("Otázka byla uložena", null, { duration: 3000 }) });
        }
      } else {
        if (this.question.id_question == 0) {
          this.deleted.emit(0);
        }
      }
    });
  }

  editAnswer(answer: Answer): void {
    this.questionsComponent.changeDirection = 0;
    const dialogRef = this.dialog.open(MathjaxEditComponent, {
      maxWidth: '1550px',
      width: '98%',
      data: {
        type: 3,
        text: answer.answer,
        points: answer.points,
        position: answer.position,
        id_question_type: this.question.id_question_type,
        relatedLists: this.relatedLists,
        question: this.question,
        newitem: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        answer.answer = result.text;
        answer.points = result.points;
        this.questionService.updateAnswer(answer).subscribe(_ => { this._snackBar.open((this.question.id_question_type == 1 ? "Odpověď " : "Podtázka ") + "byla uložena", null, { duration: 3000 }) });
      }
    });
  }

  addAnswer(): void {

    let position = "a";
    if (this.question.answers.length > 0) {
      position = String.fromCharCode(this.question.answers[this.question.answers.length - 1].position.charCodeAt(0) + 1);
    }
    this.questionsComponent.changeDirection = 0;
    const dialogRef = this.dialog.open(MathjaxEditComponent, {
      width: '70%',
      data: {
        type: 3,
        text: "",
        points: 0,
        position: position,
        id_question_type: this.question.id_question_type,
        relatedLists: this.relatedLists,
        question: this.question,
        newitem: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        let answer: Answer = {
          id_question: this.question.id_question,
          answer: result.text,
          points: result.points,
          position: result.position
        };

        this.question.answers.push(answer);

        this.questionService.addAnswer(answer).subscribe(_ => { this._snackBar.open((this.question.id_question_type == 1 ? "Odpověď " : "Podtázka ") + "byla přidána", null, { duration: 3000 }) });
      }
    });
  }

  delAnswer(answer: Answer): void {
    if (confirm("Opravdu si přejete smazat " + (this.question.id_question_type == 1 ? "odpověď " : "podtázku ") + answer.position + ") ?")) {
      this.questionService.delAnswer(answer).subscribe(alist => {
        this.question.answers = alist;
        this._snackBar.open((this.question.id_question_type == 1 ? "Odpověď " : "Podtázka ") + "byla smazána", null, { duration: 3000 })
      });
    }
  }

  moveAnswer(answer: Answer, direction: number): void {
    this.questionsComponent.changeDirection = 0;
    this.questionService.moveAnswer(answer, direction).subscribe(res => {
      this.question.answers = res.answers;
      this.question.right_answer = res.right_answer;
      this._snackBar.open((this.question.id_question_type == 1 ? "Odpověď " : "Podtázka ") + "byla přesunuta", null, { duration: 3000 })
    });
  }

  setAsRightAnswer(answer: Answer): void {
    if (this.question.right_answer == answer.position) {
      return;
    }

    this.questionsComponent.changeDirection = 0;
    this.question.right_answer = answer.position;

    this.questionService.updateQuestion(this.question).subscribe(_ => { this._snackBar.open("Odpověď " + answer.position + ") byla nastavena jako spávná", null, { duration: 3000 }) });

  }

  delQuestion(): void {
    if (confirm("Opravdu si přejete smazat otázku " + this.question.id_question + " ?")) {

      this.questionService.delQuestion(this.question).subscribe(_ => {
        this.deleted.emit(this.question.id_question);
        this._snackBar.open("Otázka byla smazána", null, { duration: 3000 })
      }, e => {
        alert(e.error)
      });
    }
  }

  questionHistory(): void {
    this.router.navigate([`/question-history/${this.question.id_question}`]);
  }

  goToId(): void {
    this.questionsComponent.goToQuestion(this.goto_id_question);
    this.goto_id_question = "";
  }

  linkToClipboard(): void {
    const url = window.location.origin + this
        .router
        .createUrlTree([{ id_question: this.question.id_question, id_category: this.question.id_category }], { relativeTo: this.route })
      .toString();

    this.copyToClipboard(url);

    this._snackBar.open("Odkaz na otázku byl vložen do schránky", null, { duration: 3000 })

  }

  copyToClipboard(item): void {
    let listener = (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
    };

    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
  }

  sumPoints(): string {
    var res = this.question.id_question_type == 3 ? this.question.answers.reduce((sum, current) => sum + current.points, 0) : this.question.points;
    return res.toString() + " " + (res == 1 ? "bod" : (res < 5 && res > 0 ? "body" : "bodů"));
  }

  trackByFn(index, item ) {
    //console.log( 'TrackBy:', item.id, 'at index', index );
    return( item.position );
  }
}
