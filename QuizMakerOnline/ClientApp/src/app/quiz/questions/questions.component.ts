import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Observable } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap, map, tap, flatMap, filter } from 'rxjs/operators';

import { Course, Category, Question, Answer, User, QuestionsFilter } from '../../quiz/questionModel';
import { QuestionService } from '../../quiz/question.service';
import { TestService } from '../test.service';
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css'],
  // Encapsulation has to be disabled in order for the
  // component style to apply to the select panel.
  encapsulation: ViewEncapsulation.None
})
export class QuestionsComponent implements OnInit {
  objectKeys = Object.keys;

  id_course: number = 0;
  rights: number = 0;

  filter: QuestionsFilter = {
    id_course: 0,
    id_category: 0,
    id_difficulty: "",
    id_user: "",
    id_type: "",
    state: "",
    sortFromOldest: false
  }

  categories: Category[] = [];
  courseCategories: Category[] = [];
  courseUsers: User[];

  allUsers: Object = {};
  questionTypes: Object = {};
  questionDifficulties: Object = {};
  questionState: Object = {};

  questions: Question[];
  question: Question;
  current: number = -1;
  gotoCurrent: number = -1;
  currentBeforeAdd: number = -1;

  goto_id_category: number = 0;
  goto_id_question: number = 0;

  loading: boolean = false;
  accessDenied: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private testService: TestService,
    private _snackBar: MatSnackBar,
    private location: Location) {
  }

  ngOnInit() {

    this.goto_id_question = +this.route.snapshot.paramMap.get("id_question");
    this.goto_id_category = +this.route.snapshot.paramMap.get("id_category");

    this.questionService.getCategories().pipe(
      flatMap(c => {
        this.categories = c;
        return this.questionService.getAllUsers();
      }),

      flatMap(o => {
        this.allUsers = o;
        return this.questionService.getQuestionTypes();
      }),

      flatMap(o => {
        this.questionTypes = o;
        return this.questionService.getQuestionDifficulties();
      }),

      flatMap(o => {
        this.questionDifficulties = o;
        return this.questionService.getQuestionState();
      }),

      flatMap(o => {
        this.questionState = o;

        return this.route.paramMap.pipe(
          map(params => {
            // (+) before `params.get()` turns the string into a number
            return +params.get('id_course');
          })
        )
      })
    ).subscribe(id => this.setCurrentCourse(id));;
  }

  setCurrentCourse(id_course: number): void {
    this.id_course = id_course;

    this.questionService.getRights(this.id_course).subscribe(r => this.rights = r);

    this.courseCategories = this.categories.filter(cat => { return cat.id_course == this.id_course });

    this.questionService.getUsers(this.id_course)/*.pipe(tap(users =>
      users.unshift(Object.assign(new User(), {
        id_user: 0,
        name: "(nerozhoduje)"
      }))))*/
      .subscribe(u => {
        this.courseUsers = u;

        let sfilter = localStorage.getItem("questions_filter_" + this.id_course);

        if (sfilter) {
          this.filter = JSON.parse(sfilter);
        }

        if (!sfilter || !this.courseCategories.find(c => c.id_category == this.filter.id_category)) {
          if (this.courseCategories.length > 0) {
            this.filter.id_category = this.courseCategories[0].id_category;
          } else {
            this.filter.id_category = 0;
          }
        }

        if (!sfilter) {
          this.filter.id_user = "";
          this.filter.id_difficulty = "";
          this.filter.id_type = "";
          this.filter.state = "";

          this.filter.sortFromOldest = false;
        }

        this.filter.id_course = this.id_course;

        this.gotoCurrent = +localStorage.getItem("questions_current_" + this.id_course);

        if (!this.gotoCurrent) {
          this.gotoCurrent = -1;
        }

        if (this.goto_id_category != 0) {
          this.filter.id_category = this.goto_id_category;
          this.filter.id_user = "";
          this.filter.id_difficulty = "";
          this.filter.id_type = "";
          this.filter.state = "";
        }

        this.onFilterChange();
      });
  }

  onFilterChange() {
    if (this.goto_id_category == 0) {
      localStorage.setItem("questions_filter_" + this.id_course, JSON.stringify(this.filter));
    }
    this.getQuestions();
    this.goto_id_category = 0;
  }

  getQuestions(): void {
    this.loading = true;
    this.questionService.getQuestions(this.filter)
      .subscribe(q => {
        this.accessDenied = false;
        setTimeout(() => { this.loading = false; }, 500);

        if (this.filter.sortFromOldest) {
          q = q.reverse();
        }

        this.questions = q;

        if (this.goto_id_question != 0) {
          this.gotoCurrent = this.questions.findIndex(q => q.id_question == this.goto_id_question);
          //this.goto_id_question = 0;
        }

        if (this.gotoCurrent >= 0 && this.gotoCurrent < this.questions.length) {
          this.current = this.gotoCurrent;
          this.question = this.questions[this.current];
          this.gotoCurrent = -1;
        } else {
          if (this.questions.length > 0) {
            this.current = 0;
            this.question = this.questions[this.current];
          } else {
            this.current = -1;
            this.question = null;
          }
        }

        if (this.goto_id_question != 0) {
          this.goto_id_question = 0;
          this.saveCurrentPosition(); //!!! 
        } else {
          this.saveCurrentPosition();
        }
      }, e => {
          this.loading = false;
          this.current = -1;
          this.question = null;
          this.questions = [];
          this.accessDenied = true;
        //alert(e.error)
      });
  }

  next(): void {
    this.current++;
    if (this.current == this.questions.length) {
      this.current = 0;
    }
    this.question = this.questions[this.current];
    this.saveCurrentPosition();
  }

  prev(): void {
    this.current--;
    if (this.current == -1) {
      this.current = this.questions.length - 1;
    }
    this.question = this.questions[this.current];
    this.saveCurrentPosition();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let targetTagName = (event.target instanceof Element ?  (<Element>event.target).tagName.toLowerCase() : "");
    //console.log(targetTagName);

    if (targetTagName == "input" || targetTagName == "textarea" || targetTagName == "mat-select") {
      return;
    }

    if (event.key === 'Left' || event.key === 'ArrowLeft') {
      this.prev();
    }

    if (event.key === 'Right' || event.key === 'ArrowRight') {
      this.next();
    }
  }

  goto(val: string | number): void {
    let n = Number(val.toString());

    if (!n || isNaN(n) || n < 1 || n > this.questions.length) {
      return;
    }

    this.current = n - 1;
    this.question = this.questions[this.current];
    this.saveCurrentPosition();
  }

  saveCurrentPosition(): void {
    localStorage.setItem("questions_current_" + this.id_course, this.current.toString());
    //this.router.navigate([`/questions/${this.id_course}`, { id_question: this.question.id_question, id_category: this.question.id_category }], { relativeTo: this.route })

    const url = this
      .router
      .createUrlTree([{ id_question: this.question.id_question, id_category: this.question.id_category }], { relativeTo: this.route })
      .toString();

    this.location./*go*/replaceState(url);
  }

  addToTest(): void {
    this.testService.add(this.question);
    this._snackBar.open("Otázka byla do testu přidána", null, { duration: 3000 });
  }

  removeFromTest(): void {
    this.testService.del(this.question);
    this._snackBar.open("Otázka byla z testu odebrána", null, { duration: 3000 });
  }

  addQuestion(): Question {
    let nq: Question = {
      id_question: 0,
      answers: [],
      id_category: this.filter.id_category == 0 ? null : this.filter.id_category,
      enter_date: null,
      id_question_difficulty: null,
      id_question_type: null,
      id_user: null,
      points: 0,
      question: "",
      right_answer: "?",
      solution: "",
      state: 0,
      canEdit: true
    }

    this.currentBeforeAdd = this.current;

    if (this.filter.sortFromOldest) {
      this.goto(this.questions.push(nq));
    } else {
      this.questions.unshift(nq);
      this.goto(1);
    }

    return nq;
  }

  onQuestionDeleted(id: number) {
    var i = this.questions.findIndex(qq => qq.id_question == id);
    if (i != -1) {
      this.questions.splice(i, 1);
      if (this.questions.length == 0) {
        this.current = -1;
        this.question = null;
      } else if (this.currentBeforeAdd != -1 && id == 0) {
        this.goto(this.currentBeforeAdd + 1);
        this.currentBeforeAdd = -1
      } else {
        this.goto(1);
      }
    }
  }

  copyQuestion() {
    this.questionService.copyQuestion(this.question.id_question).subscribe(id => {
      this.goto_id_question = id;
      this.filter.id_user = "";
      this.getQuestions();
      this._snackBar.open("Byla vytvořena kopie otázky", null, { duration: 3000 });
    });
  }

  editCategories(): void {
    this.router.navigate([`/categories/${this.id_course}`]);
  }

  editRights(): void {
    this.router.navigate([`/rights/${this.id_course}`]);
  }


  testRight(right: number): boolean {
    return (this.rights & right) != 0;
  }
}
