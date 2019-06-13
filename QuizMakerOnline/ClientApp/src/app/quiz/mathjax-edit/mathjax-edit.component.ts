import { Component, OnInit, Inject, ViewChild, AfterViewInit, HostListener } from '@angular/core';
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
  dirty: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MathjaxEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditQAData) {
    this.newtext = this.data.text;
    this.textChangedSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(s => { this.newtext = s; this.dirty = true; });
  }

  textChanged(s: string) {
    this.data.text = s;
    this.textChangedSubject.next(s);
  }

  onNoClick(): void {
    if (this.confirmDiscarChanges()) {
      this.dialogRef.close();
    }
  }

  sumPoints(): void {
    this.data.points = this.data.question.answers.reduce((sum, current) => sum + current.points, 0);
    this.dirty = true;
  }

  submit(invalid: boolean) {
    if (invalid) {
      alert("Je nutno vyplnit všechny položky.");
      return;
    }
    this.dialogRef.close(this.data);
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    if (this.confirmDiscarChanges()) {
      this.dialogRef.close();
    }
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    if (this.dirty) {
      event.returnValue = false;
    }
  }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.dialogRef.backdropClick().subscribe(_ => {
      if (this.confirmDiscarChanges()) {
        this.dialogRef.close();
      }
    })
  }

  confirmDiscarChanges(): boolean {
    if (!this.dirty) {
      return true;
    } else {
      return confirm("Opravdu si přejete zrušit změny ?");
    }
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
