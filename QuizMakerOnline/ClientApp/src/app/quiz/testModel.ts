import { Question } from './questionModel';

export class Test {
  id_test: number;
  id_course: number;
  id_semester: number;
  group: string;
  year: string;
  enter_date: Date;
  questions?: Question[];
}

export interface EditTest {
  id_course: number;
  id_semester: number;
  group: string;
  year: string;
  newitem: boolean;
  semesters: Object;
  courses: Object;
}
