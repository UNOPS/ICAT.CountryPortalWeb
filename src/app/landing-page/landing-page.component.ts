import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';

import {
  AssesmentControllerServiceProxy,
  Assessment,
  Country,
  LearningMaterial,
  Methodology,
  MitigationActionType,
  Project,
  ProjectApprovalStatus,
  ProjectControllerServiceProxy,
  ProjectOwner,
  ProjectStatus,
  Report,
  Sector,
  ServiceProxy,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit, AfterViewInit {
  learningMaterial: LearningMaterial[] = [];
  countries: Country[] = [];
  reports: Report[] = [];
  imageObject: any[] = [];
  countryObject: any[] = [];
  reportObject: any[] = [];
methologies:Methodology[]=[];



  numberOfCountries: number = 0;
  project: Project = new Project();
  obj = {
    image: '',
    thumbImage: '',
    title: '',
    description: '',
    savedLocation: '',
  };

  responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  @ViewChild('op') overlay: any;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private AssessmentProxy: AssesmentControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    let reportFilter: string[] = [];
    reportFilter.push('Report.isPublish||$eq||' + 1); //&
    // parameterFilter.push('Parameter.assessmentYear||$eq||');

    this.serviceProxy.getManyBaseMethodologyControllerMethodology(undefined,undefined,undefined,undefined,undefined,undefined,6,undefined,1,undefined).subscribe(res=>{

this.methologies=res.data.filter((value, index, self) =>
index === self.findIndex((t) => (
  t.displayName === value.displayName 
))
);
console.log('this.methologies',this.methologies)

    })

    this.serviceProxy
      .getManyBaseReportControllerReport(
        undefined,
        undefined,
        reportFilter,
        undefined,
        ['editedOn,DESC'], //["name,ASC"],
        undefined,
        100,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.reports = res.data;
        // console.log("reports",this.reports);

        this.reports.forEach((cou) => {
          this.obj = {
            image: cou?.thumbnail,
            thumbImage: cou?.thumbnail,
            title: cou?.reportName,
            description: cou?.description,
            savedLocation: cou?.savedLocation,
          };
          this.reportObject.push(this.obj);
        });
        // console.log("reports",this.reportObject);
      });

    let countryFilter: string[] = [];
    countryFilter.push('Country.isSystemUse||$eq||' + 1); //&
    // parameterFilter.push('Parameter.assessmentYear||$eq||');

    this.serviceProxy
      .getManyBaseCountryControllerCountry(
        undefined,
        undefined,
        countryFilter,
        undefined,
        ['editedOn,DESC'], //["name,ASC"],
        undefined,
        100,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.countries = res.data;
        //this.numberOfCountries = (res.data.length);
        // console.log("countries",this.countries);

        this.countries.forEach((cou) => {
          var obj = {
            image: cou.flagPath,
            thumbImage: cou.flagPath,
            title: cou.name,
          };
          this.countryObject.push(obj);
        });
      });

    let lmFilter: string[] = [];
    lmFilter.push('LearningMaterial.documentType||$eq||' + 'User Guidence') &
      lmFilter.push('LearningMaterial.isPublish||$eq||' + 1);

    this.serviceProxy
      .getManyBaseLearningMaterialControllerLearningMaterial(
        undefined,
        undefined,
        lmFilter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.learningMaterial = res.data;
        console.log('learningMaterial', this.learningMaterial);

        /*
        this.learningMaterial.forEach((val) => {
          var obj = {
            video: val.document,
            // posterImage: val.thumbnail,
            title: val.documentName,
            alt: val.documentName,
          };
          this.imageObject.push(obj);
        });
        */
      });
  }

  toNextPage() {
    this.router.navigate(['/loard-more']);
  }

  toView(lm: any) {
    console.log(lm);
    //alert("hellll");
    window.location.href = lm.document;
  }

  viewPdf(obj: Methodology) {
    window.location.href = obj.documents;
  }

  toPropose() {
    //let prAprSts = new ProjectApprovalStatus();
    // prAprSts.id = 4;
    //this.project.projectApprovalStatus = prAprSts;
    this.project.climateActionName = 'Anonymous Climate Action';
    this.project.telephoneNumber = '999999999999';
    this.project.proposeDateofCommence = moment(Date.now());
    this.project.endDateofCommence = moment(Date.now());

    this.serviceProxy
      .createOneBaseProjectControllerProject(this.project)
      .subscribe(
        (res) => {
          console.log('save', res);
          this.router.navigate(['/propose-project'], {
            queryParams: { anonymousId: res.id },
          });
        },

        (err) => {}
      );
  }

  toLogin() {
    this.router.navigate(['/login']);
  }

  public navigateToSection(section: string) {
    window.location.hash = '';
    window.location.hash = section;
  }

  toPMU() {
    window.location.href = 'https://icat-ca-tool.climatesi.com/pmu-app';
  }
}
