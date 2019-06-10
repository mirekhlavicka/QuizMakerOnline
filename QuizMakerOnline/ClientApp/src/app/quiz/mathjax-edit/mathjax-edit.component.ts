import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Question, EditQAData } from '../questionModel';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-mathjax-edit',
  templateUrl: './mathjax-edit.component.html',
  styleUrls: ['./mathjax-edit.component.css']
})
export class MathjaxEditComponent implements OnInit, AfterViewInit {
  @ViewChild('codemirror') codemirror: any;
  objectKeys = Object.keys;

  textChangedSubject: Subject<string> = new Subject<string>();
  newtext: string;

  constructor(
    public dialogRef: MatDialogRef<MathjaxEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditQAData) {
    this.newtext = this.data.text;
    this.textChangedSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(s => this.newtext = s);
  }

  textChanged(s: string) {
    this.data.text = s;
    this.textChangedSubject.next(s);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  sumPoints(): void {
    this.data.points = this.data.question.answers.reduce((sum, current) => sum + current.points, 0);
  }

  submit(form) {
    this.dialogRef.close(this.data);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.codemirror.codeMirror.refresh();
      this.codemirror.codeMirror.focus();
      // Set the cursor at the end of existing content
      this.codemirror.codeMirror.setCursor(this.codemirror.codeMirror.lineCount(), 0);
    }, 500)
  }  
}
