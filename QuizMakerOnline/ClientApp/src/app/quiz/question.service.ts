import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Question, Course, Category, User, QuestionsFilter } from './questionModel';

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

    const url = `${this.questionsUrl}/?id_category=${filter.id_category}&id_difficulty=${filter.id_difficulty}&id_user=${filter.id_user}&id_type=${filter.id_type}&state=${filter.state}`;

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
}
