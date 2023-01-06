import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportComponent } from '../report.component';

@Component({
  selector: 'app-document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.css']
})
export class DocumentReportComponent implements OnInit, AfterViewInit {
  @Input() documents: any;

  object_array: any[] = [];
  doc_name :any[] = [];
  checked: boolean = false;


    constructor(private cdr: ChangeDetectorRef, 
      public router: Router,
      private documentService: ReportComponent) { }
  
      ngAfterViewInit(): void {
        this.cdr.detectChanges();
      }
  
    ngOnInit(): void {
  
      console.log('selelcted doc form parrent',this.documents)
  
      this.object_array = Object.keys(this.documents).map((key) =>{  
        this.object_array.push({[key]:this.documents[key]})  
        // console.log('sssssssssss',this.object_array)
        
        return this.object_array;  
    }); 

    this.doc_name.push(this.object_array[0][6].reportName);
    this.doc_name.push(this.object_array[0][3].editedOn);
    this.doc_name.push(this.object_array[0][5].id)
  
    console.log('sssssssssss',this.doc_name)
    }
  
    onRedirect()
    {
    //  console.log("downloaded...")
      window.location.href = this.object_array[0][8].document; //"https://www.orimi.com/pdf-test.pdf"; // this.object_array[0][8].document
    }

    publish(reportName: string){
      // console.log('checked', event);
      if(this.checked == true){
        // console.log("button checked confirm");
        this.documentService.publish(reportName);
      }
      
    }

}
