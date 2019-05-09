import { Injectable } from '@angular/core';
import { Question } from './questionModel';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }

  private questions: Question[] = [];

  public Add(q: Question) {
    this.questions.push(q);
  }

  public Del(q: Question) {

    var i = this.questions.findIndex(qq => qq.id_question == q.id_question);
    if (i != -1) {
      this.questions.splice(i, 1)
    }
  }

  public Get(): Question[] {
    return this.questions;
  }

  public Contains(q: Question): boolean {
    return q ? this.questions.some(qq => qq.id_question == q.id_question) :  false;
  }
}
