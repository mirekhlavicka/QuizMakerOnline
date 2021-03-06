import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, filter, first, switchMap } from 'rxjs/operators';
import {
  Router,
  NavigationExtras,
  ActivatedRoute,
  ParamMap,
  NavigationEnd
} from '@angular/router';

import { AuthService } from '../auth.service';
import { Course } from '../../quiz/questionModel';
import { QuestionService } from '../../quiz/question.service';
import { TestService } from '../../quiz/test.service';
import { Title } from '@angular/platform-browser';




@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer', { static: true }) drawer: any;
  authStatusChangedSubscription: Subscription;
  isAuthenticated: boolean = false;
  fullName: string = "";

  courses: Course[];
  id_course: number = 0;
  id_test: number = 0;
  id_question: number = 0;
  course_title = "";


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 1650px)']/*Breakpoints.Handset*/)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    public testService: TestService,
    private titleService: Title ) {
  }

  ngOnInit(): void {
    this.authStatusChangedSubscription = this.authService.authStatusChanged.subscribe(
      x => { this.refreshAuthStatus()/*; alert(x)*/ });

    this.refreshAuthStatus();
    this.questionService.getCourses().subscribe(c => {
      this.courses = c;

      this.getActivatedRouteParameter().subscribe(params => {
        this.id_course = +params.get('id_course');
        this.id_test = +params.get('id_test');
        this.id_question = +params.get('id_question');

        if (this.id_course != 0) {
          let i = this.courses.findIndex(c => c.id_course == this.id_course);
          if (i != -1) {
            this.course_title = " » " + this.courses[i].name;
            if (this.router.url.lastIndexOf("categories") > -1) {
              this.course_title += " » Editace témat";
            } else if (this.router.url.lastIndexOf("rights") > -1) {
              this.course_title += " » Nastavení práv";
            } else if (this.testService.currentTestId() != -1) {
              this.course_title += " » Výběr otázek" + (this.testService.currentTestId() != 0 ? " testu " + this.testService.currentTest().year : "");
            }
          }
        } else if (this.id_test != 0) {
          setTimeout(() => {
            this.course_title = (this.id_test > 0 ? " » Editace testu " + (this.testService.currentTestId() != -1 ? this.testService.currentTest().year : "") : " » Přidání testu");
            this.titleService.setTitle("Quiz Maker " + this.course_title.replace(/»/gi, "–"));
          }, 500);          
        } else {
          this.course_title = (this.router.url.lastIndexOf("tests") > -1 ? " » Moje testy" : (this.id_question != 0 ? " » Historie použití otázky " + this.id_question : ""));
        }

        this.titleService.setTitle("Quiz Maker " + this.course_title.replace(/»/gi, "–"));
      })
    });
  }

  private getActivatedRouteParameter(): Observable<ParamMap> {
    return this.router.events.pipe(filter(e => e instanceof NavigationEnd),
      map((): ActivatedRoute => {
        let route = this.route;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route: ActivatedRoute) => route.outlet === 'primary'),
      switchMap((route: ActivatedRoute) => route.paramMap)/*, first()*/);
  }

  ngOnDestroy(): void {
    if (this.authStatusChangedSubscription) {
      this.authStatusChangedSubscription.unsubscribe()
    }
  }

  logout(): void {
    this.authService.logout().subscribe(data => {
      //alert("ok " + data);
      this.router.navigateByUrl("/login");
    }, data => {
      alert("error " + data);
    })
  }

  login(): void {
    this.router.navigateByUrl("/login");
  }

  refreshAuthStatus() {
    this.authService.isAuthenticated().subscribe(ia => this.isAuthenticated = ia);
    this.authService.fullName().subscribe(fn => this.fullName = fn);
  }

  closeSideNav() {
    if (this.drawer._mode == 'over') {
      this.drawer.close();
    }
  }
}
