import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Question } from './questionModel';
import { Course } from './questionModel';
import { Category } from './questionModel';
import { User } from './questionModel';

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

  getQuestions(id_category: number, id_difficulty: number, id_user: number, id_type: number, state: number): Observable<Question[]> {
    //const url = (id_category && id_category != 0) ? `${this.questionsUrl}/?id_category=${id_category}` : this.questionsUrl;

    const url = `${this.questionsUrl}/?id_category=${id_category}&id_difficulty=${id_difficulty}&id_user=${id_user}&id_type=${id_type}&state=${state}`;

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
