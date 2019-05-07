import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //console.log('AuthGuard#canActivate called');
    let url: string = state.url;

    return this.authService.isAuthenticated().pipe(
      map(e => {
        if (e) {
          return true;
        } else {
          this.authService.redirectUrl = url;
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((err) => {
        this.authService.redirectUrl = url;
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
