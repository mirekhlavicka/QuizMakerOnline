import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationExtras
} from '@angular/router';
//import { MatDialog } from '@angular/material'

import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) { }
  username: string;
  password: string;
  remember: boolean;

  ngOnInit() {
  }

  login(): void {
    this.authService.login(this.username, this.password, this.remember).subscribe(data => {

      let redirect = this.authService.redirectUrl ? this.router.parseUrl(this.authService.redirectUrl) : '/test';

      // Set our navigation extras object
      // that passes on our global query params and fragment
      let navigationExtras: NavigationExtras = {
        queryParamsHandling: 'preserve',
        preserveFragment: true
      };

      // Redirect the user
      this.router.navigateByUrl(redirect, navigationExtras);

    }, data => {
        alert("Neplatné jméno nebo heslo!");
    })
  }
}
