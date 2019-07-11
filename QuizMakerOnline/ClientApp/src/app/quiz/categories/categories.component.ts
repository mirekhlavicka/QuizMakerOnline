import { Component, OnInit } from '@angular/core';
import { Category } from '../questionModel';
import { QuestionService } from '../question.service';
import { ActivatedRoute } from '@angular/router';

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
    private questionService: QuestionService) { }

  ngOnInit() {
    this.id_course = +this.route.snapshot.paramMap.get('id_course');

    this.questionService.getCategories(null, this.id_course).subscribe(c => this.categories = c);
  }

}
