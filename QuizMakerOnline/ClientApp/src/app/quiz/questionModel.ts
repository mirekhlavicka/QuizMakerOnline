export class Question {
  id_question: number;
  id_category: number;
  id_user: number;
  id_question_type: number;
  id_question_difficulty: number;
  points: number;
  question: string;
  right_answer: string;
  solution: string;
  enter_date: Date;
  state: number;
  answers: Answer[];
}

export class Answer {
  position: string;
  answer: string;
  points: number;
}

export class Course {
  id_course: number;
  name: string;
  code: string;
}

export class Category {
  id_course: number;
  id_category: number;
  name: string;
}

export class User {
  id_user: number;
  name: string;
}

export class  QuestionsFilter  {
  id_category: number;
  id_difficulty: number | string;
  id_user: number | string;
  id_type: number | string;
  state: number | string;
  sortFromOldest: boolean
}
