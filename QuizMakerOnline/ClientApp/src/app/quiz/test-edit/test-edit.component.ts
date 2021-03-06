import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditTest } from '../testModel';

@Component({
  selector: 'app-test-edit',
  templateUrl: './test-edit.component.html',
  styleUrls: ['./test-edit.component.css']
})
export class TestEditComponent implements OnInit {
  objectKeys = Object.keys;
  dirty: boolean = false;

  constructor(public dialogRef: MatDialogRef<TestEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditTest) { }

  @HostListener('window:keyup.esc') onKeyUp() {
    if (this.confirmDiscardChanges()) {
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

  submit(invalid: boolean) {
    if (invalid) {
      alert("Je nutno vyplnit všechny položky.");
      return;
    }
    this.dialogRef.close(this.data);
  }

  confirmDiscardChanges(): boolean {
    if (!this.dirty) {
      return true;
    } else {
      return confirm("Opravdu si přejete zrušit změny ?");
    }
  }

  onNoClick(): void {
    if (this.confirmDiscardChanges()) {
      this.dialogRef.close();
    }
  }

  sortedObjectKeys(o: Object, byval: boolean, desc: boolean): string[] {
    let descFactor: number = 1;

    if (desc) {
      descFactor = -1;
    }

    if (byval) {
      return Object.keys(o).sort(function (a, b) { return o[a] > o[b] ? descFactor : -descFactor })
    } else {
      return Object.keys(o).sort(function (a, b) { return +a > +b ? descFactor : -descFactor })
    }
  }
}
