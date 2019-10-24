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

  constructor(
    private questionService: QuestionService,
    public dialogRef: MatDialogRef<SelectImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.questionService.getImages(this.data.id_question).subscribe(i => this.images = i);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getImgUrl(fileName: string) {
    if (fileName.endsWith(".pdf")) {
      return "/api/upload/PdfRasterize/" + fileName;
    } else {
      return "/staticfiles/images/" + fileName;
    }
  }

  onSelectClick(img: any): void {
    this.dialogRef.close(img.latex);
  }

  @HostListener('window:keyup.esc') onKeyUp() {
      this.dialogRef.close();
  }
}
