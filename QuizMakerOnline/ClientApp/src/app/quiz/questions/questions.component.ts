import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { Course, Category, Question, Answer, User } from '../../quiz/questionModel';
import { QuestionService } from '../../quiz/question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, flatMap } from 'rxjs/operators';



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

  id_category: number = 0;
  id_difficulty: number = 0;
  id_user: number = 0;
  id_type: number = 0;
  state: number = -1;

  categories: Category[] = [];
  courseCategories: Category[] = [];
  courseUsers$: Observable<User[]>;

  allUsers: Object = {};
  questionTypes: Object = {};
  questionDifficulties: Object = {};
  questionState: Object = {};

  questions: Question[];
  question: Question;
  current: number = -1;

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService) {
  }

  ngOnInit() {

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
        this.questionState= o;

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

    this.courseCategories = this.categories.filter(cat => { return cat.id_course == this.id_course });

    if (this.courseCategories.length > 0) {
      this.id_category = this.courseCategories[0].id_category;
    } else {
      this.id_category = 0;
    }

    this.courseUsers$ = this.questionService.getUsers(this.id_course).pipe(tap(users =>
      users.unshift(Object.assign(new User(), {
        id_user: 0,
        name: "(nerozhoduje)"
      }))));

    this.id_user = 0;
    this.id_difficulty = 0;
    this.id_type = 0;

    this.onFilterChange();
  }

  onFilterChange() {
    //console.log(this.id_category + "," + this.id_user + "," + this.id_difficulty);
    this.getQuestions();
  }

  getQuestions(): void {
    //let selectedId: number = +this.route.snapshot.paramMap.get('id_question');

    this.loading = true;
    this.questionService.getQuestions(this.id_category, this.id_difficulty, this.id_user, this.id_type, this.state)
      .subscribe(q => {
        this.loading = false;
        this.questions = q;

        if (this.questions.length > 0) {
          this.current = 0;
          this.question = this.questions[this.current];
        } else {
          this.current = -1;
          this.question = null;
        }

        /*if (selectedId != 0) {
          this.current = this.questions.findIndex(q => q.id_question == selectedId)
        } else {
          this.current = -1;
        }

        if (this.current == -1) {
          this.current = 0;
          this.question = this.questions[this.current];
          this.router.navigate(['/quiz', { id_question: this.question.id_question }])
        } else {
          this.question = this.questions[this.current];
        }*/
      });
  }

  next(): void {
    this.current++;
    if (this.current == this.questions.length) {
      this.current = 0;
    }
    this.question = this.questions[this.current];
    //this.router.navigate(['/quiz', { id_question: this.question.id_question }])
  }

  prev(): void {
    this.current--;
    if (this.current == -1) {
      this.current = this.questions.length - 1;
    }
    this.question = this.questions[this.current];
    //this.router.navigate(['/quiz', { id_question: this.question.id_question }])
  }

  goto(val: string | number): void {
    let n = Number(val.toString());

    if (!n || isNaN(n) || n < 1 || n > this.questions.length) {
      return;
    }

    this.current = n - 1;
    this.question = this.questions[this.current];
    //this.router.navigate(['/quiz', { id_question: this.question.id_question }])
  }

  addToTest(): void {

  }
}
