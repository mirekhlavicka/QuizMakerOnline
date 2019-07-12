import { Component, OnInit } from '@angular/core';
import { Category } from '../questionModel';
import { QuestionService } from '../question.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  id_course: number;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private location: Location) { }

  ngOnInit() {
    this.id_course = +this.route.snapshot.paramMap.get('id_course');

    this.questionService.getCategories(null, this.id_course).subscribe(c => this.categories = c);
  }

  updateCategory(c: Category): void {
    this.questionService.updateCategory(c).subscribe(_ => { });
  }

  delCategory(c: Category): void {
    if (confirm("Opravdu si přejete smazat téma " + c.name + " ?")) {
    }
  }

  addCategory(): void {
    this.categories.push(
      Object.assign(new Category(),
        {
          id_course: this.id_course,
          id_category: 0,
          name: "???"
        }));
  }

  goBack(): void {
    this.location.back();
  }
}
