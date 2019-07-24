import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserCourseRights } from '../questionModel';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../question.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-course-rights',
  templateUrl: './course-rights.component.html',
  styleUrls: ['./course-rights.component.css']
})
export class CourseRightsComponent implements OnInit {
  id_course: number;
  userCourseRights: UserCourseRights[] = [];


  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private location: Location,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.id_course = +this.route.snapshot.paramMap.get('id_course');

    this.questionService.getUsersRights(this.id_course).subscribe(ur => this.userCourseRights = ur);

  }

  testRight(rights:number, right: number): boolean {
    return (rights & right) != 0;
  }

  setRight(ucr: UserCourseRights, right: number, checked: boolean): void {
    if (checked) {
      ucr.rights = ucr.rights | right;
    } else {
      ucr.rights = ucr.rights & ~right;
    }
  }
  goBack(): void {
    this.location.back();
  }

}
