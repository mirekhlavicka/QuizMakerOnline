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

  private test: Test = null;

  constructor(private http: HttpClient) {
    //let saved = localStorage.getItem("saved_test");

    //if (saved) {
    //  this.questions = JSON.parse(saved);
    //}
  }

  //private questions: Question[] = [];

  public last_currentTestId: number = -1;

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

  public add(q: Question) {
    if (this.test) {
      this.test.questions.push(q);
    }
    //this.save();
  }

  public del(q: Question) {
    if (this.test) {
      var i = this.test.questions.findIndex(qq => qq.id_question == q.id_question);
      if (i != -1) {
        this.test.questions.splice(i, 1);
        //this.save();
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
        //this.save();
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
        //this.save();
      }
    }
  }

  public getQuestions(): Question[] {
    if (this.test) {
      return this.test.questions;
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

  //private save(): void {
  //  localStorage.setItem("saved_test", JSON.stringify(this.questions));
  //}


  /*************************************************/

  //selected_id_test: number = 0;

  last_pageIndex: number = 0;
  last_pageSize: number = 0;

  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.testsUrl)
      .pipe(
        //tap(_ => this.last_pageIndex = 0),
        catchError(this.handleError<Test[]>('getTests', []))
      );
  }

  getTest(id_test: number): Observable<Test> {
    return this.http.get<Test>(`${this.testsUrl}/${id_test}`)
      .pipe(
        tap(t => this.test = t),
        catchError(this.handleError<Test>('getTests', null))
      );
  }

  getSemesters(): Observable<Object> {
    return this.http.get<Object>(this.semestersUrl);
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
