import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { QuestionService } from '../question.service';
import { TestService } from '../test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
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

  courses: Object = {};
  semesters: Object = {};  

  showSolution: boolean = false;
  showPoints: boolean = true;
  infoBarItems: number = 1 | 2 | 4 | 8 | 16 | 32;

  constructor(private questionService: QuestionService,
    public testService: TestService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    let stemp = localStorage.getItem("test_InfoBarItems");

    if (stemp) {
      this.infoBarItems = +stemp;
    }

    stemp = localStorage.getItem("test_showSolution");
    if (stemp) {
      this.showSolution = (stemp == "true");
    }

    stemp = localStorage.getItem("test_showPoints");
    if (stemp) {
      this.showPoints = (stemp == "true");
    }

    this.getData();
  }

  getData(): void {
    this.id_test = +this.route.snapshot.paramMap.get('id_test');

    this.testService.getMyCourses().pipe(
      flatMap(c => {
        this.courses = c;
        return this.testService.getSemesters();
      }),
      flatMap(s => {
        this.semesters = s;
        return this.testService.getTest(this.id_test);
      })
    ).subscribe(test => {
      this.test = test;
      if (!test) {
        alert("Test nelze editovat!");
        this.location.back();
      }
      else if (this.test.id_test <= 0) {
        this.editTest()
      }
    });
  }

  removeFromTest(q: Question) {
    if (confirm("Opravdu si přejete odebrat otázku z testu ?")) {
      this.testService.del(q);
      this._snackBar.open("Otázka byla z testu odebrána", null, { duration: 3000 });
    }
  }

  moveUp(q: Question) {
    this.testService.moveUp(q);
    this._snackBar.open("Otázka byla přesunuta", null, { duration: 3000 });
  }

  moveDown(q: Question) {
    this.testService.moveDown(q);
    this._snackBar.open("Otázka byla přesunuta", null, { duration: 3000 });
  }

  print(): void {
    this.router.navigate(['/',
      {
        outlets: {
          'print': ['printtest', { showSolution: this.showSolution, showPoints: this.showPoints, infoBarItems: this.infoBarItems }]
        }
      }], { skipLocationChange: true });
  }

  goBack(): void {
    //this.location.back();
    this.testService.noCurrentTest();
    this.router.navigate(["/tests"]);
  }

  goToQuestions(): void {
    this.router.navigate([`/questions/${this.test.id_course}`]);
  }

  goToQuestion(q: Question): void {
    this.questionService.getCategories(q.id_category).subscribe(c => this.router.navigate([`/questions/${c[0].id_course}`, { id_question: q.id_question, id_category: q.id_category }]));    
  }

  editTest(): void {
    const dialogRef = this.dialog.open(TestEditComponent, {
      width: '450px',
      data: {
        group: this.test.group,
        year: this.test.year,
        id_semester: this.test.id_semester,
        id_course: this.test.id_course,
        newitem: this.test.id_test <= 0,
        semesters: this.semesters,
        courses: this.courses
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.test.group = result.group;
        this.test.year = result.year;
        this.test.id_semester = result.id_semester;
        this.test.id_course = result.id_course;

        if (this.test.id_test <= 0) {
          this.testService.addTest(this.test).subscribe(t => {
            this.test.id_test = t.id_test;
            this.test.enter_date = t.enter_date;
            this.test.year = t.year;
            this.router.navigate([`/test/${t.id_test}`]);
            this._snackBar.open("Test byl přidán", null, { duration: 3000 })
          });
        } else {
          this.testService.updateTest(this.test).subscribe(_ => { this._snackBar.open("Test byl uložen", null, { duration: 3000 }) });
        }
      } else if (this.test.id_test <= 0) {
        this.goBack();
      }
    });
  }

  delTest(): void {
    if (confirm("Opravdu si přejete smazat test " + this.test.id_test + " ?")) {

      this.testService.delTest(this.test).subscribe(_ => {
        this.goBack();
        this._snackBar.open("Test byl smazán", null, { duration: 3000 });
      }, e => {
        alert(e.error)
      });
    }
  }

  testInfoBarItemsBit(b: number, notlast: boolean = false): boolean {
    return (this.infoBarItems & b) != 0 && (!notlast || this.infoBarItems >= 2 * b);
  }

  setInfoBarItemsBit(b: number, checked: boolean) {
    if (checked) {
      this.infoBarItems = this.infoBarItems | b;
    } else {
      this.infoBarItems = this.infoBarItems & ~b;
    }

    localStorage.setItem("test_InfoBarItems", this.infoBarItems.toString());
  }

  onShowChange(): void {
    localStorage.setItem("test_showPoints", this.showPoints.toString());
    localStorage.setItem("test_showSolution", this.showSolution.toString());
  }
}
