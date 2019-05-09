import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map, tap, flatMap, filter } from 'rxjs/operators';

import { Course, Category, Question, Answer, User, QuestionsFilter } from '../../quiz/questionModel';
import { QuestionService } from '../../quiz/question.service';
import { TestService } from '../test.service';



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

  filter: QuestionsFilter = {
    id_category: 0,
    id_difficulty: 0,
    id_user: 0,
    id_type: 0,
    state: -1,
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

  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService,
    private testService: TestService) {
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

    this.courseCategories = this.categories.filter(cat => { return cat.id_course == this.id_course });

    this.questionService.getUsers(this.id_course).pipe(tap(users =>
      users.unshift(Object.assign(new User(), {
        id_user: 0,
        name: "(nerozhoduje)"
      }))))
      .subscribe(u => {
        this.courseUsers = u;

        let sfilter = localStorage.getItem("questions_filter_" + this.id_course);

        if (sfilter) {
          this.filter = JSON.parse(sfilter);
        } else {
          if (this.courseCategories.length > 0) {
            this.filter.id_category = this.courseCategories[0].id_category;
          } else {
            this.filter.id_category = 0;
          }

          this.filter.id_user = 0;
          this.filter.id_difficulty = 0;
          this.filter.id_type = 0;
          this.filter.state = -1;

          this.filter.sortFromOldest = false;
        }

        this.gotoCurrent = +localStorage.getItem("questions_current_" + this.id_course);

        if (!this.gotoCurrent) {
          this.gotoCurrent = -1;
        }

        this.onFilterChange();
      });
  }

  onFilterChange() {
    localStorage.setItem("questions_filter_" + this.id_course, JSON.stringify(this.filter));
    this.getQuestions();
  }

  getQuestions(): void {
    this.loading = true;
    this.questionService.getQuestions(this.filter)
      .subscribe(q => {
        setTimeout(() => { this.loading = false; }, 500);

        if (this.filter.sortFromOldest) {
          q = q.reverse();
        }

        this.questions = q;

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

        this.saveCurrentPosition();
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
  }

  addToTest(): void {
    this.testService.Add(this.question);
  }

  removeFromTest(): void {
    this.testService.Del(this.question);
  }
}
