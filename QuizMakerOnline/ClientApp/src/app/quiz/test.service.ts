import { Injectable } from '@angular/core';
import { Question } from './questionModel';
import { Test } from './testModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private testsUrl = 'api/tests';
  private semestersUrl = 'api/tests/semesters';
  private coursesUrl = 'api/tests/courses';

  private test: Test = null;

  public last_pageIndex: number = 0;
  public last_pageSize: number = 0;
  public last_currentTestId: number = -1;
  public last_filter_id_course: number = 0;

  public courses: Object = {};
  public semesters: Object = {};  

  constructor(private http: HttpClient) {
  }  

  public currentTest(): Test{
    if (this.test) {
      return this.test;
    } else {
      return null;
    }
  }

  public currentTestId(): number {
    if (this.test) {
      return this.test.id_test;
    } else {
      return -1;
    }
  }

  public noCurrentTest(): void {
    if (this.test) {
      this.last_currentTestId = this.currentTestId();
      this.test = null;
    }
  }

  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.testsUrl)
      .pipe(
        catchError(this.handleError<Test[]>('getTests', []))
      );
  }

  getTest(id_test: number): Observable<Test> {
    return (id_test <= 0 ? of(Object.assign(new Test(),
      {
        id_test: -1,
        id_course: null,
        id_semester: null,
        group: "",
        year: "", //new Date().getFullYear().toString(),
        enter_date: new Date(),
        questions: []
      })) : this.http.get<Test>(`${this.testsUrl}/${id_test}`))
      .pipe(
        tap(t => this.test = t),
        catchError(this.handleError<Test>('getTests', null))
      );
  }

  getSemesters(): Observable<Object> {
    return this.http.get<Object>(this.semestersUrl)
      .pipe(
        tap(s => this.semesters = s),
        catchError(this.handleError<Object>('getSemesters', null))
      );
  }

  getMyCourses(): Observable<Object> {
    return this.http.get<Object>(this.coursesUrl)
      .pipe(
        tap(c => this.courses = c),
        catchError(this.handleError<Object>('getMyCourses', null))
      );
  }

  private addQuestion(q: Question): Observable<any> {
    return this.http.put(`${this.testsUrl}/questions/${this.test.id_test}/${q.id_question}`, null, httpOptions).pipe(
      catchError(this.handleError<any>('addQuestion'))
    );
  }

  private delQuestion(q: Question): Observable<any> {
    return this.http.delete(`${this.testsUrl}/questions/${this.test.id_test}/${q.id_question}`, httpOptions).pipe(
      catchError(this.handleError<any>('delQuestion'))
    );
  }

  private swapQuestions(q1: Question, q2: Question): Observable<any> {
    return this.http.put(`${this.testsUrl}/swapquestions/${this.test.id_test}/${q1.id_question}/${q2.id_question}`, null, httpOptions).pipe(
      catchError(this.handleError<any>('addQuestion'))
    );
  }


  public add(q: Question) {
    if (this.test) {
      this.test.questions.push(q);
      this.addQuestion(q).subscribe(_ => { });
    }
  }

  public del(q: Question) {
    if (this.test) {
      var i = this.test.questions.findIndex(qq => qq.id_question == q.id_question);
      if (i != -1) {
        this.test.questions.splice(i, 1);
        this.delQuestion(q).subscribe(_ => { });
      }
    }
  }

  public moveUp(q: Question) {
    if (this.test) {
      var i = this.test.questions.findIndex(qq => qq.id_question == q.id_question);
      if (i > 0) {
        let tmp = this.test.questions[i];
        this.test.questions[i] = this.test.questions[i - 1];
        this.test.questions[i - 1] = tmp;
        this.swapQuestions(this.test.questions[i], this.test.questions[i - 1]).subscribe(_ => { });
      }
    }
  }

  public moveDown(q: Question) {
    if (this.test) {
      var i = this.test.questions.findIndex(qq => qq.id_question == q.id_question);
      if (i >= 0 && i < this.test.questions.length - 1) {
        let tmp = this.test.questions[i];
        this.test.questions[i] = this.test.questions[i + 1];
        this.test.questions[i + 1] = tmp;
        this.swapQuestions(this.test.questions[i], this.test.questions[i + 1]).subscribe(_ => { });
      }
    }
  }

  updateTest(test: Test): Observable<any> {
    return this.http.put(this.testsUrl, test, httpOptions).pipe(
      catchError(this.handleError<any>('updateTest'))
    );
  }

  addTest(test: Test): Observable<Test> {
    return this.http.post(this.testsUrl, test, httpOptions).pipe(
      catchError(this.handleError<any>('addTest'))
    );
  }

  delTest(test: Test): Observable<any> {
    return this.http.delete(`${this.testsUrl}/${test.id_test}`, httpOptions).pipe(
    );
  }

  randomRightAnswer(test: Test): Observable<any> {
    return this.http.put(`${this.testsUrl}/randomrightanswer/${test.id_test}`, httpOptions).pipe(
    );
  }

  public getQuestions(): Question[] {
    if (this.test) {
      return this.test.questions;
    } else {
      return null;
    }
  }

  public getQuestionIdList(): string {
    if (this.test) {
      return this.test.questions.map(q => q.id_question).join(",");
    } else {
      return "";
    }
  }

  get count(): number {
    if (this.test) {
      return this.test.questions.length;
    } else {
      return -1;
    }
  }

  public contains(q: Question): boolean {
    if (this.test) {
      return q ? this.test.questions.some(qq => qq.id_question == q.id_question) : false;
    } else {
      return false;
    }
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
