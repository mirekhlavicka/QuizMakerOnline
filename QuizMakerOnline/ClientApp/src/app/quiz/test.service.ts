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

  constructor(private http: HttpClient) {
    let saved = localStorage.getItem("saved_test");

    if (saved) {
      this.questions = JSON.parse(saved);
    }
  }

  private questions: Question[] = [];

  public add(q: Question) {
    this.questions.push(q);
    this.save();
  }

  public del(q: Question) {

    var i = this.questions.findIndex(qq => qq.id_question == q.id_question);
    if (i != -1) {
      this.questions.splice(i, 1);
      this.save();
    }
  }

  public moveUp(q: Question) {
    var i = this.questions.findIndex(qq => qq.id_question == q.id_question);
    if (i > 0) {
      let tmp = this.questions[i];
      this.questions[i] = this.questions[i - 1];
      this.questions[i - 1] = tmp;
      this.save();
    }
  }

  public moveDown(q: Question) {
    var i = this.questions.findIndex(qq => qq.id_question == q.id_question);
    if (i >= 0 && i < this.questions.length - 1) {
      let tmp = this.questions[i];
      this.questions[i] = this.questions[i + 1];
      this.questions[i + 1] = tmp;
      this.save();
    }
  }

  public getQuestions(): Question[] {
    return this.questions;
  }

  public getQuestionIdList(): string {
    return this.questions.map(q => q.id_question).join(",");
  }

  get count(): number {
    return this.questions.length;
  }

  public contains(q: Question): boolean {
    return q ? this.questions.some(qq => qq.id_question == q.id_question) :  false;
  }

  private save(): void {
    localStorage.setItem("saved_test", JSON.stringify(this.questions));
  }


/*************************************************/
  getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(this.testsUrl)
    .pipe(
    //  tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Test[]>('getTests', []))
    );
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
