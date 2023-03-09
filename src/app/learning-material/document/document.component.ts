import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css'],
})
export class DocumentComponent implements OnInit, AfterViewInit {
  @Input() documents: any;

  object_array: any[] = [];
  doc_name: any[] = [];

  constructor(private cdr: ChangeDetectorRef, public router: Router) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
  ngOnInit(): void {
    this.object_array = Object.keys(this.documents).map((key) => {
      this.object_array.push({ [key]: this.documents[key] });

      return this.object_array;
    });
    this.doc_name.push(this.object_array[0][6].documentName);
    this.doc_name.push(this.object_array[0][3].editedOn);
  }

  onRedirect() {
    window.location.href = this.object_array[0][7].document;
  }
}
