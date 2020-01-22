import { Component, OnInit, Inject, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question, EditQAData } from '../questionModel';
import { Subject } from 'rxjs';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SelectImageComponent } from '../select-image/select-image.component';

@Component({
  selector: 'app-mathjax-edit',
  templateUrl: './mathjax-edit.component.html',
  styleUrls: ['./mathjax-edit.component.css']
})
export class MathjaxEditComponent implements OnInit, AfterViewInit {
  @ViewChild('codemirror', { static: true }) codemirror: any;
  objectKeys = Object.keys;

  textChangedSubject: Subject<string> = new Subject<string>();
  newtext: string;
  dirty: boolean = false;
  dragover: boolean = false;
  selectFileOpened = false;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
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
    if (this.confirmDiscardChanges()) {
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

  insertTextAtCursor(text: string): void {
    var doc = this.codemirror.codeMirror.getDoc();
    var cursor = doc.getCursor();
    doc.replaceRange(text, cursor);
  }

  public uploadFile = (files) => {
    if (files.length === 0 || this.data.question.id_question == 0) {
      return;
    }

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.http.post(`api/upload/${this.data.question.id_question}`, formData, { reportProgress: true, observe: 'events' })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          //this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.insertTextAtCursor((event.body as any).latex);
          //this.insertTextAtCursor('<img src="' + (event.body as any).relativeURL + '" width="200"/>');
          //this.message = 'Upload success.';
          //this.onUploadFinished.emit(event.body);
        }
      });
  }

  selectFile(): void {
    this.selectFileOpened = true;
    const dialogRef = this.dialog.open(SelectImageComponent, {
      maxWidth: '1650px',
      width: '98%',
      data: {
        id_question: this.data.question.id_question,
        id_category: this.data.question.id_category
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.selectFileOpened = false;
      if (result != null) {
        this.insertTextAtCursor(result);
      }
    });
  }


  //Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.uploadFile(files)
    }
    this.dragover = false;
  }

  //Dragover listener
  @HostListener('dragover', ['$event']) onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragover = true;
  }

  //Dragleave listener
  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this.dragover = false;
  }

  //Paste listener
  @HostListener('paste', ['$event']) public onpaste(evt) {
    const items = (evt.clipboardData || evt.originalEvent.clipboardData).items;
    let blob = null;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
        this.uploadFile([blob]);
        evt.preventDefault();
        evt.stopPropagation();
      }
    }
  }



  @HostListener('window:keyup.esc') onKeyUp() {
    if (!this.selectFileOpened && this.confirmDiscardChanges()) {
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
      if (this.confirmDiscardChanges()) {
        this.dialogRef.close();
      }
    })
  }

  confirmDiscardChanges(): boolean {
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
