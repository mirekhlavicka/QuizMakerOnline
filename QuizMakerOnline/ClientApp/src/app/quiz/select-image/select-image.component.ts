import { Component, OnInit, Inject, HostListener, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.css']
})
export class SelectImageComponent implements OnInit {

  images: any[] = [];
  categories: any[] = [];
  selected_id_category: number = 0;
  @ViewChild(MatDrawer, { static: true }) drawer: MatDrawer;

  constructor(
    private questionService: QuestionService,
    public dialogRef: MatDialogRef<SelectImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.selected_id_category = this.data.id_category;

    this.questionService.getImageCategories().subscribe(c => {
      this.categories = c;
      this.loadImages(this.selected_id_category);
    });    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getImgUrl(fileName: string, rasterize: boolean) {
    if (rasterize && fileName.endsWith(".pdf")) {
      return "/api/upload/PdfRasterize/" + fileName;
    } else {
      return "/staticfiles/images/" + fileName;
    }
  }

  getImgName(fileName: string) {
    return fileName.replace(/^[0-9]*\//, "")
  }

  loadImages(id_category: number) {
    this.selected_id_category = id_category;
    this.questionService.getImages(this.data.id_question, this.selected_id_category).subscribe(i => {
      this.images = i;
      if (this.images.length == 0) {
        this.drawer.open();
      }
    });
  }

  onSelectClick(img: any): void {
    this.dialogRef.close(img.latex);
  }

  isCourseSelected(course: any): boolean {
    return (course.categories as any[]).find(c => c.id_category == this.selected_id_category);
  }


  @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
  }
}
