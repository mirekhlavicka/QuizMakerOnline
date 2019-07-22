import { Question } from './questionModel';

export class Test {
  id_user: number;
  id_test: number;
  id_course: number;
  id_semester: number;
  group: string;
  year: string;
  enter_date: Date;
  questions?: Question[];

  user_name?: string;
  course_name?: string;
  semester_name?: string;
  canEdit?: boolean;
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
