import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-course-rights',
  templateUrl: './course-rights.component.html',
  styleUrls: ['./course-rights.component.css']
})
export class CourseRightsComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  goBack(): void {
    this.location.back();
  }

}
