import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UserCourseRights } from '../questionModel';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from '../question.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


@Component({
  selector: 'app-course-rights',
  templateUrl: './course-rights.component.html',
  styleUrls: ['./course-rights.component.css']
})
export class CourseRightsComponent implements OnInit {
  id_course: number;
  userCourseRights: UserCourseRights[] = [];
  filteredUserCourseRights: UserCourseRights[] = [];

  searchTerms = new Subject<string>();

  rightChangedSubject: Subject<UserCourseRights> = new Subject<UserCourseRights>();
  changedUCR: Set<UserCourseRights> = new Set<UserCourseRights>();


  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private location: Location,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.id_course = +this.route.snapshot.paramMap.get('id_course');

    this.questionService.getRights(this.id_course).subscribe(r => {
      if (r & 8) {
        this.questionService.getUsersRights(this.id_course).subscribe(ur => {
          this.userCourseRights = ur;
          this.filteredUserCourseRights = this.userCourseRights
        });
      } else {
        this.goBack();
      }
    });

    this.rightChangedSubject.pipe(
      debounceTime(1600))
      .subscribe(() => {
        let list: string[] = [];
        this.changedUCR.forEach(ucr => {
          //console.log(ucr.user_name);
          this.questionService.updateUsersRights(ucr).subscribe(_ => { });
          list.push(ucr.user_name);
        });
        this._snackBar.open("Práva " + list.join(", ") + " uložena", null, { duration: 3000 });
        this.changedUCR.clear()
      });

    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(s => {
      if (s != "") {
        this.filteredUserCourseRights = this.userCourseRights.filter(ucr => {
          return ucr.user_name
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .startsWith(s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        })
      } else {
        this.filteredUserCourseRights = this.userCourseRights;
      }
    });
  }

  testRight(rights: number, right: number): boolean {
    return (rights & right) != 0;
  }

  setRight(ucr: UserCourseRights, right: number, checked: boolean): void {
    if (checked) {
      ucr.rights = ucr.rights | right;
    } else {
      ucr.rights = ucr.rights & ~right;
    }

    this.changedUCR.add(ucr);
    this.rightChangedSubject.next(ucr);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  goBack(): void {
    this.location.back();
  }
}
