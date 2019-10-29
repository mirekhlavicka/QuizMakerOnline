import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { QuestionService } from '../question.service';

@Component({
  selector: 'app-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.css']
})
export class SelectImageComponent implements OnInit {

  images: any[] = [];
  selected_id_category: number = 0;

  constructor(
    private questionService: QuestionService,
    public dialogRef: MatDialogRef<SelectImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.selected_id_category = this.data.id_category;
    this.loadImages(this.selected_id_category);
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
    this.questionService.getImages(this.data.id_question, this.selected_id_category).subscribe(i => this.images = i);
  }

  onSelectClick(img: any): void {
    this.dialogRef.close(img.latex);
  }

  @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
  }
}
