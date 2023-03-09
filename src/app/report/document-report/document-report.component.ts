import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReportComponent } from '../report.component';

@Component({
  selector: 'app-document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.css'],
})
export class DocumentReportComponent implements OnInit, AfterViewInit {
  @Input() documents: any;

  object_array: any[] = [];
  doc_name: any[] = [];
  checked = false;

  constructor(
    private cdr: ChangeDetectorRef,
    public router: Router,
    private documentService: ReportComponent,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.object_array = Object.keys(this.documents).map((key) => {
      this.object_array.push({ [key]: this.documents[key] });

      return this.object_array;
    });

    this.doc_name.push(this.object_array[0][6].reportName);
    this.doc_name.push(this.object_array[0][3].editedOn);
    this.doc_name.push(this.object_array[0][5].id);
  }

  onRedirect() {
    window.location.href = this.object_array[0][8].document;
  }

  publish(reportName: string) {
    if (this.checked == true) {
      this.documentService.publish(reportName);
    }
  }
}
