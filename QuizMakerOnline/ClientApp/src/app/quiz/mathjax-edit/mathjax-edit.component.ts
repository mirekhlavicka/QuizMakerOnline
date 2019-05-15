import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Question } from '../questionModel';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-mathjax-edit',
  templateUrl: './mathjax-edit.component.html',
  styleUrls: ['./mathjax-edit.component.css']
})
export class MathjaxEditComponent implements OnInit {

  textChangedSubject: Subject<string> = new Subject<string>();
  newtext: string;

  constructor(
    public dialogRef: MatDialogRef<MathjaxEditComponent>,
    @Inject(MAT_DIALOG_DATA) public text: string) {
    this.newtext = this.text;
    this.textChangedSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(s => this.newtext = s);
  }

  textChanged(s: string) {
    this.text = s;
    this.textChangedSubject.next(s);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}