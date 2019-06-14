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




@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: any;
  authStatusChangedSubscription: Subscription;
  isAuthenticated: boolean = false;
  fullName: string = "";

  courses: Course[];
  id_course: number = 0;
  course_title = "";


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 1440px)']/*Breakpoints.Handset*/)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    public testService: TestService) {
  }

  ngOnInit(): void {
    this.authStatusChangedSubscription = this.authService.authStatusChanged.subscribe(
      x => { this.refreshAuthStatus()/*; alert(x)*/ });

    this.refreshAuthStatus();
    this.questionService.getCourses().subscribe(c => {
      this.courses = c;

      this.getActivatedRouteParameter().subscribe(params => {
        this.id_course = +params.get('id_course');

        //console.log(this.id_course);

        if (this.id_course != 0) {
          let i = this.courses.findIndex(c => c.id_course == this.id_course);
          if (i != -1) {
            this.course_title = " – " + this.courses[i].name;
          }
        } else {
          this.course_title = (this.router.url.lastIndexOf("test") > -1 ? " – Moje testy" : "");          
        }

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
