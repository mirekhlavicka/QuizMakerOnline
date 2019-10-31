import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Question, Course, Category, User, QuestionsFilter, Answer, UserCourseRights } from './questionModel';
import { Test } from './testModel';
import { formatDate } from '@angular/common';

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
  private usersrightsUrl = 'api/questions/usersrights';
  private questiontypesUrl = 'api/questions/questiontypes';
  private questiondifficultiesUrl = 'api/questions/questiondifficulties';
  private questionstateUrl = 'api/questions/questionstate';
  private questionhistoryUrl = 'api/questions/history';
  private questionimagesUrl = 'api/questions/images';
  private questionimagecategoriesUrl = 'api/questions/imagecategories';

  private answersUrl = 'api/answers';

  constructor(private http: HttpClient) { }

  getRights(id_course: number): Observable<number> {
    return this.http.get<number>(`${this.questionsUrl}/rights/${id_course}`);
    //.pipe(
    //  tap(_ => this.log('fetched heroes')),
    //  catchError(this.handleError<Hero[]>('getHeroes', []))
    //);
  }


  //getQuestions(): Observable<Question[]> {
  //  return this.http.get<Question[]>(this.questionsUrl);
  //    //.pipe(
  //    //  tap(_ => this.log('fetched heroes')),
  //    //  catchError(this.handleError<Hero[]>('getHeroes', []))
  //    //);
  //}

  getQuestions(filter: QuestionsFilter): Observable<Question[]> {
    //const url = (id_category && id_category != 0) ? `${this.questionsUrl}/?id_category=${id_category}` : this.questionsUrl;

    let nuf = "";

    if (filter.notUsedFrom) {
      nuf = formatDate(filter.notUsedFrom, 'yyyy-MM-dd', 'en-US');
    }

    const url = `${this.questionsUrl}/?id_course=${filter.id_course}&id_category=${filter.id_category}&id_difficulty=${filter.id_difficulty}&id_user=${filter.id_user}&id_type=${filter.id_type}&state=${filter.state}&nuf=${nuf}&nufbm=${filter.notUsedFromByMe ? 1 : 0}`;

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

  getCategories(id_category?: number, id_course?: number): Observable<Category[]> {
    let url = this.categoriesUrl;
    if (id_category) {
      url += "?id_category=" + id_category;
    }

    if (id_course) {
      url += (id_category ? "&" : "?") + "id_course=" + id_course;
    }

    return this.http.get<Category[]>(url);
    //.pipe(
    //  tap(_ => this.log('fetched heroes')),
    //  catchError(this.handleError<Hero[]>('getHeroes', []))
    //);
  }

  updateCategory(category: Category): Observable<any> {
    return this.http.put(this.categoriesUrl, category, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateCategory'))
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.http.post(this.categoriesUrl, category, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('addCategory'))
    );
  }

  delCategory(category: Category): Observable<any> {
    return this.http.delete(`${this.categoriesUrl}/${category.id_category}`, httpOptions).pipe(
      //tap(_ => this.log(`updated hero id=${hero.id}`)),
      //catchError(this.handleError<any>('delQuestion'))
    );
  }


  getUsers(id_course: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}/${id_course}`);
    //.pipe(
    //  tap(_ => this.log('fetched heroes')),
    //  catchError(this.handleError<Hero[]>('getHeroes', []))
    //);
  }

  getUsersRights(id_course: number): Observable<UserCourseRights[]> {
    return this.http.get<UserCourseRights[]>(`${this.usersrightsUrl}/${id_course}`);
  }

  updateUsersRights(ucr: UserCourseRights): Observable<any> {
    return this.http.put(this.usersrightsUrl, ucr, httpOptions).pipe(
      catchError(this.handleError<any>('updateUsersRights'))
    );
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

  copyQuestion(id_question: number): Observable<number> {
    return this.http.get<number>(`${this.questionsUrl}/copy/${id_question}`);
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

  moveAnswer(answer: Answer, direction: number): Observable<any/*Answer[]*/> {
    return this.http.put/*<Answer[]>*/(`${this.answersUrl}/move?direction=${direction}`, answer, httpOptions).pipe(
      catchError(this.handleError<Answer[]>('moveAnswer'))
    );
  }

  getHistoryTests(id_question: number): Observable<Test[]> {
    return this.http.get<Test[]>(`${this.questionhistoryUrl}/${id_question}`)
      .pipe(
        catchError(this.handleError<Test[]>('getHistoryTests', []))
      );
  }

  getImages(id_question: number, id_category: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.questionimagesUrl}/${id_question}?id_category=${id_category}`)
      .pipe(
        catchError(this.handleError<Test[]>('getImages', []))
      );
  }

  getImageCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.questionimagecategoriesUrl}`)
      .pipe(
        catchError(this.handleError<Test[]>('getImageCategories', []))
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
