import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Methodology,
  Report,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-loard-more',
  templateUrl: './loard-more.component.html',
  styleUrls: ['./loard-more.component.css'],
})
export class LoardMoreComponent implements OnInit, AfterViewInit {
  reports: Report[] = [];
  reportObject: any[] = [];
  preportObject: any[] = [];
  methologies: Methodology[] = [];
  allmethologies: Methodology[] = [];
  totalRecords = 0;
  rows = 6;
  first = 0;

  obj = {
    image: '',
    thumbImage: '',
    title: '',
    description: '',
    savedLocation: '',
  };

  @ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,

    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    const reportFilter: string[] = [];
    reportFilter.push('Report.isPublish||$eq||' + 1);
    this.serviceProxy
      .getManyBaseMethodologyControllerMethodology(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        1000,
        undefined,
        1,
        undefined,
      )
      .subscribe((res) => {
        this.allmethologies = res.data.filter(
          (value, index, self) =>
            index ===
            self.findIndex((t) => t.displayName === value.displayName),
        );
        this.methologies = this.allmethologies.slice(0, 6);
        this.totalRecords = this.allmethologies.length;
      });
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.methologies = [];
    for (let x = this.first; x < this.first + this.rows; x++) {
      if (x < this.allmethologies.length)
        this.methologies.push(this.allmethologies[x]);
    }
  }

  viewPdf(obj: Methodology) {
    window.location.href = obj.documents;
  }
}
