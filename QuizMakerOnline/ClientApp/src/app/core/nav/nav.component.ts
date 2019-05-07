import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Router,
  NavigationExtras
} from '@angular/router';

import { AuthService } from '../auth.service';
import { Course } from '../../quiz/questionModel';
import { QuestionService } from '../../quiz/question.service';




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

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(['(max-width: 1440px)']/*Breakpoints.Handset*/)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService, private router: Router, private questionService: QuestionService) {
  }

  ngOnInit(): void {
    this.authStatusChangedSubscription = this.authService.authStatusChanged.subscribe(
      x => { this.refreshAuthStatus()/*; alert(x)*/ });

    this.refreshAuthStatus();
    this.questionService.getCourses().subscribe(c => {
      this.courses = c;
    });
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
