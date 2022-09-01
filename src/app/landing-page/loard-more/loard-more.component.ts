import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Methodology, Report, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-loard-more',
  templateUrl: './loard-more.component.html',
  styleUrls: ['./loard-more.component.css']
})
export class LoardMoreComponent implements OnInit, AfterViewInit  {



reports: Report[] = [];
reportObject : any[] = [];
preportObject : any[] = [];
methologies:Methodology[]=[];
allmethologies:Methodology[]=[];
totalRecords: number = 0;
rows: number = 6;  // change this when you want to show more details in a page
//last: number = 5;
first = 0;

obj = {
  image:'',
  thumbImage:'',
  title: '',
  description: '',
  savedLocation:'',
};

@ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,

  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {

    let reportFilter: string[] = [];
    reportFilter.push('Report.isPublish||$eq||'+1); //&
   // parameterFilter.push('Parameter.assessmentYear||$eq||');
   this.serviceProxy.getManyBaseMethodologyControllerMethodology(undefined,undefined,undefined,undefined,undefined,undefined,1000,undefined,1,undefined).subscribe(res=>{
    this.allmethologies=res.data.filter((value, index, self) =>
    index === self.findIndex((t) => (
      t.displayName === value.displayName 
    ))
    );
    this.methologies=this.allmethologies.slice(0,6);
    this.totalRecords=this.allmethologies.length
    console.log('this.methologies',this.allmethologies)
    
        })     

    // this.serviceProxy.getManyBaseReportControllerReport(
    //   undefined,
    //   undefined,
    //   reportFilter,
    //   undefined,
    //   ["editedOn,DESC"],     //["name,ASC"],
    //   undefined,
    //   100,
    //   0,
    //   0,
    //   0
    //  ).subscribe((res: any) => {
    //   this.reports = res.data;
    //  // console.log("reports",this.reports);

    //   this.reports.forEach((cou) => {
    //     this.obj = {
    //       image:cou?.thumbnail,
    //       thumbImage: cou?.thumbnail,
    //       title: cou?.reportName,
    //       description: cou?.description,
    //       savedLocation: cou?.savedLocation,
    //     };
    //     this.reportObject.push(this.obj);
    //   });
    //   this.totalRecords = this.reportObject.length;
    //   for(let x = this.first; x< (this.first+this.rows); x++)
    //   {
    //     this.preportObject.push(this.reportObject[x]);
    //   }
    //  // console.log("reports",this.reportObject);
    // }); 

  }


  onPageChange(event :any)
  {
   // console.log("my event...",event);
    this.first = event.first; //= Index of the first record
     this.rows = event.rows;    //= Number of rows to display in new page
     //this.page = event.page = Index of the new page
        //event.pageCount = Total number of pages
        this.methologies = [];
      for(let x = this.first; x< (this.first+this.rows); x++)
      {
        if(x<this.allmethologies.length)
        this.methologies.push(this.allmethologies[x]);
      }
     // console.log("my paginated obj...",this.preportObject);
  }

  viewPdf(obj:Methodology)
{
  window.location.href = obj.documents;
}

}
