import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Question, Course, Category, User, QuestionsFilter, Answer } from './questionModel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private questionsUrl = 'api/questions';
  private coursesUrl = 'api/questions/courses';
  private categoriesUrl = 'api/questions/categories';
  private usersUrl = 'api/questions/users';
  private allUsersUrl = 'api/questions/allusers';
  private questiontypesUrl = 'api/questions/questiontypes';
  private questiondifficultiesUrl = 'api/questions/questiondifficulties';
  private questionstateUrl = 'api/questions/questionstate';

  private answersUrl = 'api/answers';

  constructor(private http: HttpClient) { }

  //getQuestions(): Observable<Question[]> {
  //  return this.http.get<Question[]>(this.questionsUrl);
  //    //.pipe(
  //    //  tap(_ => this.log('fetched heroes')),
  //    //  catchError(this.handleError<Hero[]>('getHeroes', []))
  //    //);
  //}

  getQuestions(filter: QuestionsFilter): Observable<Question[]> {
    //const url = (id_category && id_category != 0) ? `${this.questionsUrl}/?id_category=${id_category}` : this.questionsUrl;

    const url = `${this.questionsUrl}/?id_course=${filter.id_course}&id_category=${filter.id_category}&id_difficulty=${filter.id_difficulty}&id_user=${filter.id_user}&id_type=${filter.id_type}&state=${filter.state}`;

    return this.http.get<Question[]>(url);
    //.pipe(
    //  tap(_ => this.log('fetched heroes')),
    //  catchError(this.handleError<Hero[]>('getHeroes', []))
    //);
  }


  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.coursesUrl);
    //.pipe(
    //  tap(_ => this.log('fetched heroes')),
    //  catchError(this.handleError<Hero[]>('getHeroes', []))
    //);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
    //.pipe(
    //  tap(_ => this.log('fetched heroes')),
    //  catchError(this.handleError<Hero[]>('getHeroes', []))
    //);
  }

  getUsers(id_course: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/${id_course}`);
    //.pipe(
    //  tap(_ => this.log('fetched heroes')),
    //  catchError(this.handleError<Hero[]>('getHeroes', []))
    //);
  }

  getAllUsers(): Observable<Object> {
    return this.http.get<Object>(this.allUsersUrl);
  }

  getQuestionTypes(): Observable<Object> {
    return this.http.get<Object>(this.questiontypesUrl);
  }

  getQuestionDifficulties(): Observable<Object> {
    return this.http.get<Object>(this.questiondifficultiesUrl);
  }

  getQuestionState(): Observable<Object> {
    return this.http.get<Object>(this.questionstateUrl);
  }

  /** PUT: update the question on the server */
  updateQuestion(question: Question): Observable<any> {
    return this.http.put(this.questionsUrl, question, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateQuestion'))
    );
  }

  /** POST: add the question on the server */
  addQuestion(question: Question): Observable<Question> {
    return this.http.post(this.questionsUrl, question, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('addQuestion'))
    );
  }

  /** DELETE: update the question on the server */
  delQuestion(question: Question): Observable<any> {
    return this.http.delete(`${this.questionsUrl}/${question.id_question }`, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      //catchError(this.handleError<any>('delQuestion'))
    );
  }


  /** PUT: update the answer on the server */
  updateAnswer(answer: Answer): Observable<any> {
    return this.http.put(this.answersUrl, answer, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateAnswer'))
    );
  }

  /** POST: add the answer on the server */
  addAnswer(answer: Answer): Observable<any> {
    return this.http.post(this.answersUrl, answer, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('addAnswer'))
    );
  }

  /** DELETE: delete the answer from the server */
  delAnswer(answer: Answer): Observable<Answer[]> {

    return this.http.delete<Answer[]>(`${this.answersUrl}/${answer.id_question}/${answer.position}`, httpOptions).pipe(
      //tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Answer[]>('delAnswer'))
    );
  }

  moveAnswer(answer: Answer, direction: number): Observable<Answer[]> {
    return this.http.put<Answer[]>(`${this.answersUrl}/move?direction=${direction}`, answer, httpOptions).pipe(
      catchError(this.handleError<Answer[]>('moveAnswer'))
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
