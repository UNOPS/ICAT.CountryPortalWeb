import {
  AssessmentYearControllerServiceProxy,
  Institution,
  InstitutionControllerServiceProxy,
  Parameter,
  ParameterControllerServiceProxy,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestControllerServiceProxy,
  UpdateDeadlineDto,
} from './../../../shared/service-proxies/service-proxies';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
// import {MessageModule} from 'primeng/message';
// import { strictEqual } from 'assert';
import { Project, ServiceProxy } from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.css'],
})
export class DataRequestComponent implements OnInit, AfterViewInit {
  climateactions: Project[];
  selectedClimateActions: Project[];
  climateaction: Project = new Project();
  relatedItems: Project[] = [];
  yearList: any[] = [];
  temYearList: any[];

  cols: any;
  columns: any;
  options: any;
  confirm1: boolean = false;
  dataRequestList: any[] = [];
  minDate: Date;
  displayHistory: boolean = false;
  paraId: number;
  requestHistoryList: any[] = [];
  // sectorList: string[] = new Array();
  instuitutionList: Institution[];
  //mitigationActionList: MitigationActionType[] = [];
  selectedParameters: any[];
  selectedDeadline: Date;

  dataReqAssignCA: any[] = [];
  assignCAArray: any[] = [];

  searchText: string;
  // hasChildParm:boolean = false;

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;

  searchBy: any = {
    text: null,
    year: null,
    climateaction: null,
    institution: null,
  };

  dataProviderList: Institution[];
  displayDataProvider: boolean = false;
  selectedDataProvider: Institution;
  selectedParameter: Parameter;
  selectDataProvider: boolean = false;

  parameterDisplay: boolean = false;
  parentParameter: Parameter[];
  childParameter: Parameter[];
  isAlternative: boolean;
  disableButton: boolean = false;
  first = 0;

  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy,
    private parameterRqstProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private messageService: MessageService,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private institutionProxy: InstitutionControllerServiceProxy
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

 async ngOnInit(): Promise<void> {


  this.parameterRqstProxy
  .getNewDataRequestForClimateList(0, 0, '', 0, '', 0, '1234').subscribe(res=>{
    // console.log("test country",res)
          for(let a of res.items){
            // console.log("test countrya",a)
            
            if (a.parameter.Assessment !== null) {
              if (
                !this.assignCAArray.includes(
                  a.parameter.Assessment.Prject
                    .climateActionName
                )
              ) {
              
                this.assignCAArray.push(
                  a.parameter.Assessment.Prject
                    .climateActionName
                );
                this.dataReqAssignCA.push(
                a.parameter.Assessment.Prject
                );
              }
            }

            
            
          }
// console.log('test countrydataReqAssignCA===', this.dataReqAssignCA);

  })
    setTimeout(() => {
      this.parameterRqstProxy
        .getNewDataRequest(1, this.rows, '', 0, '', 0, '1234')
        .subscribe((a) => {
          console.log('aa', a);
          if (a) {
            this.dataRequestList = a.items;
            console.log('ttttttttt', this.dataRequestList);
            // for (let x = 0; x < this.dataRequestList.length; x++) {
            //   //   console.log(x)

            //   if (this.dataRequestList[x].parameter.Assessment !== null) {
            //     if (
            //       !this.assignCAArray.includes(
            //         this.dataRequestList[x].parameter.Assessment.Prject
            //           .climateActionName
            //       )
            //     ) {
            //       console.log(
            //         this.dataRequestList[x].parameter.Assessment.Prject
            //           .climateActionName
            //       );
            //       this.assignCAArray.push(
            //         this.dataRequestList[x].parameter.Assessment.Prject
            //           .climateActionName
            //       );
            //       // this.dataReqAssignCA.push(
            //       //   this.dataRequestList[x].parameter.Assessment.Prject
            //       // );
            //     }
            //   }
            // }
            console.log('dataReqAssignCA===', this.dataReqAssignCA);

            console.log('assignCAArray===', this.assignCAArray);
            // this.totalRecords = a.meta.totalItems;
          }
          // this.loading = false;
        });
    }, 10);
   let req= await this.institutionProxy.getInstitutionDataProvider(1, 1000, '', 0).toPromise();
   
   this.instuitutionList = req.items;
    // this.totalRecords = 0;
    // this.institutionProxy
    //   .getInstitutionDataProvider(1, 1000, '', 0)
    //   .subscribe((req) => {
    //     this.instuitutionList = req.items;

    //     console.log('institutionlist', this.instuitutionList);
    //   });

    this.minDate = new Date();
    let filter1: string[] = new Array();
    filter1.push('projectApprovalStatus.id||$eq||' + 5);
    this.serviceProxy
      .getManyBaseProjectControllerProject(
        undefined,
        undefined,
        filter1,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      )
      .subscribe((res: any) => {
        this.climateactions = res.data;
        console.log('my list....s', res.data);
      });
    // this.serviceProxy
    //   .getManyBaseProjectControllerProject(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['editedOn,DESC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.climateactions = res.data;
    //     this.totalRecords = res.totalRecords;
    //     if (res.totalRecords !== null) {
    //       this.last = res.count;
    //     } else {
    //       this.last = 0;
    //     }

    //     console.log('climateactions', res.data);
    //     // for(let project of res.data){
    //     //   this.migrationActionList.push(project.migrationAction);
    //     //   console.log("111",this.migrationActionList)
    //     //   console.log("222",project.migrationAction)
    //     //   // console.log("M-action",project.migrationAction)
    //     // }
    //     // this.migrationActionList.map(this.climateaction)
    //   });

    // this.serviceProxy
    //   .getManyBaseInstitutionControllerInstitution(
    //     undefined,
    //     undefined,
    //     undefined,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res) => {
    //     this.instuitutionList = res.data;
    //   });

    //this part  comment to show only relevent count and sector institution list in getInstiDetails method

    // let filter2: string[] = new Array();

    // filter2.push('type.id||$eq||' + 3);

    // this.serviceProxy
    //   .getManyBaseInstitutionControllerInstitution(
    //     undefined,
    //     undefined,
    //     filter2,
    //     undefined,
    //     ['name,ASC'],
    //     undefined,
    //     1000,
    //     0,
    //     0,
    //     0
    //   )
    //   .subscribe((res: any) => {
    //     this.instuitutionList = res.data;
    //     // console.log('my institutions', res.data);
    //   });
  }

  onCAChange(event: any) {
    console.log('searchby', this.searchBy);
  if(this.searchBy.climateaction){  this.assessmentYearProxy
      .getAllByProjectId(this.searchBy.climateaction.id)
      .subscribe((res: any) => {
        this.yearList = res;
        const tempYearList = getUniqueListBy(this.yearList, 'assessmentYear');
        this.yearList = tempYearList;
        console.log('yearlist----', this.yearList);
      });}

    function getUniqueListBy(arr: any, key: any) {
      return [
        ...new Map(
          arr.map((item: { [x: string]: any }) => [item[key], item])
        ).values(),
      ];
    }

    this.onSearch();
  }

  onYearChange(event: any) {
    this.onSearch();
    console.log('searchby', this.searchBy);
  }

  onInstitutionChange(event: any) {
    console.log('searchby', this.searchBy);
    this.onSearch();
  }
  onSendClick() {
    if (this.selectedParameters.length > 0) {
      for(let drqst of this.selectedParameters){
        if( !drqst.parameter.institution){
       
          this.messageService.add({
            severity: 'error',
            summary: 'Error.',
            detail: 'Please select a data provider.',
          });
          return;
  
  
        }
      }
      
      this.confirm1 = true;
    }
  }

  onSearchClick(event: any) {
    this.onSearch();
  }

  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  // /////////////////////////////////////////////

  showDataProviders(parameter: Parameter) {
    this.selectedParameter = parameter;
    this.selectedDataProvider = this.selectedParameter.institution;
    if (this.selectedDataProvider) {
      this.dataProviderList = this.instuitutionList.filter(
        (inst: Institution) => inst.id != this.selectedParameter.institution.id
      );
    }else{
      this.dataProviderList=this.instuitutionList;

    }
    // console.log('parameter',parameter)

    this.displayDataProvider = true;
  }

  updateDataProviders() {
    // console.log('workdata',this.selectedDataProvider)
    if (
      this.selectedDataProvider != undefined &&
      this.selectedDataProvider.id != null &&
      this.selectedDataProvider.id != this.selectedParameter.institution?.id
    ) {
      this.selectDataProvider = false;

      // console.log('selectedParameter',this.selectedParameter)
      // console.log('selectedDataProvider',this.selectedDataProvider)
      this.selectedParameter.institution = this.selectedDataProvider;
      // console.log('selectedParameter2',this.selectedParameter)
      this.serviceProxy
        .updateOneBaseParameterControllerParameter(
          this.selectedParameter.id,
          this.selectedParameter
        )
        .subscribe(
          (res) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Data provider were updated successfully',
            });

            let event: any = {};
            event.rows = this.rows;
            event.first = 0;

            this.loadgridData(event);
            this.displayDataProvider = false;
          },
          (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error.',
              detail: 'Internal server error, please try again.',
            });
          }
        );
    } else {
      this.selectDataProvider = true;
      // this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
      // this.messageService.add({
      //   severity: 'error',
      //   summary: 'Error.',
      //   detail: 'Select data provider.',
      // });
    }
  }

  showAlternativity(para: any) {
    this.isAlternative = para.isAlternative ? para.isAlternative : false;
    console.log('para', para);
    if (para.isAlternative) {
      console.log(para.ParentParameterId);
      //  let filter1: string[] = [];
      //    filter1.push('id||$eq||' + para.parentParameterId);
      this.serviceProxy
        .getOneBaseParameterControllerParameter(
          para.ParentParameterId,
          undefined,
          undefined,
          undefined
        )
        .subscribe((res) => {
          console.log('parachild', res);
          this.parentParameter = [res];
          let filter1: string[] = [];
          filter1.push('ParentParameterId||$eq||' + res.id);
          this.serviceProxy
            .getManyBaseParameterControllerParameter(
              undefined,
              undefined,
              filter1,
              undefined,
              undefined,
              undefined,
              1000,
              0,
              0,
              0
            )
            .subscribe((res) => {
              console.log('para', res);

              this.childParameter = res.data;
              this.disableButton =
                this.childParameter.length < 1 ? true : false;
            });
        });
    } else {
      this.parentParameter = [para];
      let filter1: string[] = [];
      filter1.push('ParentParameterId||$eq||' + para.id);
      this.serviceProxy
        .getManyBaseParameterControllerParameter(
          undefined,
          undefined,
          filter1,
          undefined,
          undefined,
          undefined,
          1000,
          0,
          0,
          0
        )
        .subscribe((res) => {
          console.log('para', res);

          this.childParameter = res.data;
          this.disableButton = this.childParameter.length < 1 ? true : false;
        });
    }

    this.parameterDisplay = true;
  }
  activateAlternativity(isAlternative: boolean) {
    this.childParameter.map((a) => {
      a.isEnabledAlternative = !isAlternative;
      console.log('para alt', this.isAlternative);
      return a;
    });
    console.log(this.childParameter);
    this.parentParameter[0].isEnabledAlternative = !isAlternative;
    this.parameterProxy
      .updateParameterAlternative([
        this.parentParameter[0],
        ...this.childParameter,
      ])
      .subscribe(
        (res) => {
          if (res) {
            let event: any = {};
            event.rows = this.rows;
            event.first = 0;
            this.loadgridData(event);

            this.parameterDisplay = false;
            this.childParameter = [];
            this.parentParameter = [];
          }
        },
        (err) => {}
      );
  }

  cancelActiveAlternative() {
    // this.selectedDataProvider=new Institution();
    // this.selectedParameter=new Parameter();

    this.parentParameter = [];
    this.childParameter = [];
    this.parameterDisplay = false;
    // console.log("work",this.selectedDataProvider)
  }

  cancelDataProviders() {
    // this.selectedDataProvider=new Institution();
    // this.selectedParameter=new Parameter();
    this.selectDataProvider = false;
    this.displayDataProvider = false;

    this.parameterDisplay = false;
    // console.log("work",this.selectedDataProvider)
  }

  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let climateActionId = this.searchBy.climateaction
      ? this.searchBy.climateaction.id
      : 0;
    let institutionId = this.searchBy.institution
      ? this.searchBy.institution.id
      : 0;
    let year = this.searchBy.year ? this.searchBy.year.assessmentYear : '';
    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    let pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;
    setTimeout(() => {
      this.parameterRqstProxy
        .getNewDataRequest(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          year,
          institutionId,
          '1234'
        )
        .subscribe((a) => {
          console.log('aa', a);
          if (a) {
            this.dataRequestList = a.items;
            console.log('data requests.....', this.dataRequestList);
            this.totalRecords = a.meta.totalItems;
          }
          this.loading = false;
        });
    }, 1);
  };

  addproject() {
    this.router.navigate(['/propose-project']);
  }

  detail() {
    this.router.navigate(['/project-information']);
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  getInfo(obj: any) {
    console.log('dataRequestList...', obj);
    this.paraId = obj.parameter.id;
    console.log('this.paraId...', this.paraId);

    // let x = 602;
    this.prHistoryProxy
      .getHistroyByid(this.paraId) // this.paraId
      .subscribe((res) => {
        this.requestHistoryList = res;

        console.log('this.requestHistoryList...', this.requestHistoryList);
      });
    //  let filter1: string[] = [];
    //  filter1.push('parameter.id||$eq||' + this.paraId);
    //  this.serviceProxy
    //  .getManyBaseParameterRequestControllerParameterRequest(
    //    undefined,
    //    undefined,
    //    filter1,
    //    undefined,
    //    undefined,
    //    undefined,
    //    1000,
    //    0,
    //    0,
    //    0
    //  )
    //  .subscribe((res: any) => {
    //    this.requestHistoryList =res.data;

    //    console.log('this.requestHistoryList...', this.requestHistoryList);
    //  });

    this.displayHistory = true;
  }

  isLastPage(): boolean {
    return this.climateactions
      ? this.first === this.climateactions.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.climateactions ? this.first === 0 : true;
  }

  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;

    // this.onClimateActionStatusChange(a);
  }

  removeFromString(arr: string[], str: string) {
    let escapedArr = arr.map((v) => escape(v));
    let regex = new RegExp(
      '(?:^|\\s)' + escapedArr.join('|') + '(?!\\S)',
      'gi'
    );
    return str.replace(regex, '');
  }
  onClickSend(status: number) {
    if (!this.selectedDeadline) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error.',
        detail: 'Please select a valid date.',
      });
      return;
    }

    let idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      
     
      const element = this.selectedParameters[index];
      idList.push(element.id);
    }

    let inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = idList;
    inputParameters.status = status;
    console.log('this.selectedDeadline', this.selectedDeadline);
    inputParameters.deadline = moment(this.selectedDeadline);
    this.parameterRqstProxy.updateDeadline(inputParameters).subscribe(
      (res) => {
        this.confirm1 = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Deadline & Status were updated successfully',
        });
        this.selectedParameters = [];
        this.onSearch();
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      }
    );
  }
}
