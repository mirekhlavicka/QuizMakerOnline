import { Injectable } from '@angular/core';
import { Question } from './questionModel';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() {
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

  get count(): number {
    return this.questions.length;
  }

  public contains(q: Question): boolean {
    return q ? this.questions.some(qq => qq.id_question == q.id_question) :  false;
  }

  private save(): void {
    localStorage.setItem("saved_test", JSON.stringify(this.questions));
  }
}
