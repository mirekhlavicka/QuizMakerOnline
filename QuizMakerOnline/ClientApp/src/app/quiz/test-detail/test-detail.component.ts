import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { QuestionService } from '../question.service';
import { TestService } from '../test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Test } from '../testModel';
import { Course, Question } from '../questionModel';
import { TestEditComponent } from '../test-edit/test-edit.component';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.css']
})
export class TestDetailComponent implements OnInit {

  id_test: number;
  test: Test;

  courses: Course[];
  semesters: Object = {};  

  showSolution: boolean = false;
  showPoints: boolean = true;

  constructor(private questionService: QuestionService,
    public testService: TestService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.id_test = +this.route.snapshot.paramMap.get('id_test');

    this.questionService.getCourses().pipe(
      flatMap(c => {
        this.courses = c;
        return this.testService.getSemesters();
      }),
      flatMap(s => {
        this.semesters = s;
        return this.testService.getTest(this.id_test);
      })
    ).subscribe(test => this.test = test);
  }

  removeFromTest(q: Question) {
    if (confirm("Opravdu si přejete odebrat otázku z testu ?")) {
      this.testService.del(q);
    }
  }

  moveUp(q: Question) {
    this.testService.moveUp(q);
  }

  moveDown(q: Question) {
    this.testService.moveDown(q);
  }

  print(): void {
    this.router.navigate(['/',
      {
        outlets: {
          'print': ['printtest', { showSolution: this.showSolution, showPoints: this.showPoints }]
        }
      }], { skipLocationChange: true });
  }

  courseName(id: number): string {
    return this.courses.find(c => c.id_course == id).name;
  }

  goBack(): void {
    //this.location.back();
    this.testService.noCurrentTest();
    this.router.navigate(["/tests"]);
  }

  goToQuestions(): void {
    this.router.navigate([`/questions/${this.test.id_course}`]);
  }

  editTest(): void {
    const dialogRef = this.dialog.open(TestEditComponent, {
      width: '450px',
      data: {
        group: this.test.group,
        year: this.test.year,
        id_semester: this.test.id_semester,
        id_course: this.test.id_course,
        newitem: false,
        semesters: this.semesters
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.test.group = result.group;
        this.test.year = result.year;
        this.test.id_semester = result.id_semester;
      }
    });
  }
}
