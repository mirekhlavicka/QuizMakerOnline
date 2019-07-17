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
  canEdit: boolean;
  answers: Answer[];
}

export class Answer {
  id_question: number;
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
  count?: number;
}

export class User {
  id_user: number;
  name: string;
}

export class  QuestionsFilter  {
  id_course: number;
  id_category: number;
  id_difficulty: number | string;
  id_user: number | string;
  id_type: number | string;
  state: number | string;
  sortFromOldest: boolean
}

export interface EditQAData {
  type: number;
  text: string;
   
  points?: number;

  id_category?: number;
  id_user?: number;
  id_question_type?: number;
  id_question_difficulty?: number;
  right_answer?: string;
  state?: number;

  relatedLists: RelatedLists;
  question: Question;
  position: string;

  newitem: boolean;
}

export interface RelatedLists {
  courseCategories: Category[];
  allUsers: Object;
  questionTypes: Object;
  questionDifficulties: Object;
  questionState: Object;
}
