import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import * as moment from 'moment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import decode from 'jwt-decode';
import { read, utils, writeFile } from 'xlsx';
// import { strictEqual } from 'assert';
import {
  AssessmentYearControllerServiceProxy,
  Country,
  // CountryControllerServiceProxy
  ParameterControllerServiceProxy,
  ParameterHistoryControllerServiceProxy,
  ParameterRequestControllerServiceProxy,
  Project,
  ServiceProxy,
  UnitConversionControllerServiceProxy,
  UpdateDeadlineDto,
  UpdateValueEnterData,
} from 'shared/service-proxies/service-proxies';
import * as XLSX from 'xlsx';
import { DataRequestStatus } from 'app/Model/DataRequestStatus.enum';
import Parameter from 'app/Model/parameter';

@Component({
  selector: 'app-enter-data',
  templateUrl: './enter-data.component.html',
  styleUrls: ['./enter-data.component.css'],
})
export class EnterDataComponent implements OnInit, AfterViewInit {


  climateactions: Project[]=[];
  assignCAArray: any[] = [];

  movies: any[] = [];
  country:Country;


  parameterList: any[];
  parameterListFilterData: any[] = [];
  mainParameterListFilterData: any[] = [];
  parameterListFilterDataLK: any[] = [];
  unitTypeList: any[];
  selectedParameter: any;
  selectedYear: string;
  selectedId: number;
  selectedParameterId: number;
  selectedUnit = { ur_fromUnit: '' };
  selectedValue: string;
  selectedAssumption: string;
  reasonForReject: string;
  selectedDataRequestId: number;
  selectedParameters: any[];
  selectedPara: any;
  selectedHistoricalValue: any;

  cols: any;
  columns: any;
  options: any;
  confirm1: boolean = false;
  confirm2: boolean = false;
  isHistorical: boolean = false;
  uploadFile: boolean = false;
  yearList: any[] = [];
  // sectorList: string[] = new Array();
  userName: string;

  loading: boolean;
  totalRecords: number = 0;
  rows: number = 10;
  last: number;
  event: any;
  user_role:string;
  searchBy: any = {
    text: null,
    climateaction: null,
    year: null,
  };
  unit:any={ur_fromUnit:null,};

  first = 0;
  paraId: number;
  requestHistoryList: any[] = [];
  displayHistory: boolean = false;
  public fileData: File;
  SERVER_URL = environment.baseUrlExcelUpload; //'http://localhost:7080/parameter/upload'
  isOpen: boolean = false;
  userCountryId:number = 0;
  userSectorId:number = 0;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    // private countryProxy: CountryControllerServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy,
    private projectProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private messageService: MessageService,
    private unitTypesProxy: UnitConversionControllerServiceProxy,
    private parameterRequestProxy: ParameterRequestControllerServiceProxy,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private httpClient: HttpClient
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  ngOnInit(): void {

    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId  = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    this.user_role=tokenPayload.roles[0]
    this.totalRecords = 0;
    this.userName = localStorage.getItem('user_name')!;
    console.log('this.userName..', this.userName);



    this.serviceProxy
    .getOneBaseCountryControllerCountry(
      this.userCountryId,
      undefined,
      undefined,
      0
    )
    .subscribe((res: any) => {
      this.country = res;
      }
    )

    let filter2: string[] = new Array();

    filter2.push('projectApprovalStatus.id||$eq||' + 5);

      this.projectProxy
      .getEnterDataParameter(
        0,
        0,
        '',
        0,
        '',
        this.userName,
        '1234'
      )
      .subscribe((res: any) => {
      
        for(let a of res.items){   
           if (a.parameterId.Assessment !== null) {
          
          if (
            !this.assignCAArray.includes(
              a.parameterId.Assessment.Prject
                .climateActionName
            )
          ) {
           
            this.assignCAArray.push(
              a.parameterId.Assessment.Prject
                .climateActionName
            );
            this.climateactions.push(
             a.parameterId.Assessment.Prject
            );
          }
        }}



      });
  }  

  handleImport($event: any) {
    const files = $event.target.files;
    if (files.length) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const wb = read(event.target.result);
            const sheets = wb.SheetNames;

            if (sheets.length) {
                const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
                this.movies = rows;
            }
        }
        reader.readAsArrayBuffer(file);
    }
}

  onCancel() {
    this.confirm1 = false;
    this.isHistorical = false;
  }

  onCAChange(event: any) {
    console.log('searchby...', this.searchBy);

    if (this.searchBy.climateaction?.id != null) {
      //console.log('inside..');

      this.assessmentYearProxy
        .getAllByProjectId(this.searchBy.climateaction?.id)
        .subscribe((res: any) => {
          this.yearList = res;

          console.log('yearlist', res);
        });
      //this.onSearch();
    }
    this.onSearch();
  }

  onYearChange(event: any) {
    this.onSearch();
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
  loadgridData = (event: LazyLoadEvent) => {
    console.log('event Date', event);
    this.loading = true;
    this.totalRecords = 0;

    let climateActionId = this.searchBy.climateaction
      ? this.searchBy.climateaction.id
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

    console.log('==========pageNumber++', pageNumber);
    console.log('==========this.rows++', this.rows);

    setTimeout(() => {
      this.projectProxy
        .getEnterDataParameter(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          year,
          this.userName,
          '1234'
        )
        .subscribe((a) => {
          console.log('aa', a);
          if (a) {
            this.parameterList = a.items;
            this.totalRecords = a.meta.totalItems;
            this.getHistoricalParameters(a.items)
          }
          this.loading = false;
        });
    }, 1);
  };

  getHistoricalParameters(parameters: any[]) {
    let methodologyCodes: any[] = [];
    let parameterCodes: any[] = [];
    let assessmentIds: any[] = [];
    parameters.forEach((para: any) => {
      if (para.parameterId?.methodologyCode) methodologyCodes.push(para.parameterId.methodologyCode)
      if (para.parameterId?.code) parameterCodes.push(para.parameterId.code)
    });

    let filter = ['methodologyCode||$in||' + [...new Set(methodologyCodes)],
    'code||$in||' + [...new Set(parameterCodes)]]

    this.serviceProxy
      .getManyBaseParameterControllerParameter(
        undefined,
        undefined,
        filter,
        undefined,
        undefined,
        undefined,
        1000,
        0,
        0,
        0
      ).subscribe(res => {
        if (res.data.length > 0) {
          this.parameterList = this.parameterList.map((para: any) =>{
            let parameters = res.data.filter((p:any) => (p.code == para.parameterId.code) && p.value )
            if(para.parameterId.vehical) parameters = this.filterParameters(parameters, 'vehical', para.parameterId.vehical)
            if(para.parameterId.fuelType) parameters = this.filterParameters(parameters, 'fuelType', para.parameterId.fuelType)
            if(para.parameterId.powerPlant) parameters = this.filterParameters(parameters, 'powerPlant', para.parameterId.powerPlant)
            if(para.parameterId.route) parameters = this.filterParameters(parameters, 'route', para.parameterId.route)
            if(para.parameterId.feedstock) parameters = this.filterParameters(parameters, 'feedstock', para.parameterId.feedstock)
            if(para.parameterId.soil) parameters = this.filterParameters(parameters, 'soil', para.parameterId.soil)
            if(para.parameterId.stratum) parameters = this.filterParameters(parameters, 'stratum', para.parameterId.stratum)
            if(para.parameterId.residue) parameters = this.filterParameters(parameters, 'residue', para.parameterId.residue)
            if(para.parameterId.landClearance) parameters = this.filterParameters(parameters, 'landClearance', para.parameterId.landClearance)
            if(para.parameterId.methodologyCode) parameters = this.filterParameters(parameters, 'methodologyCode', para.parameterId.methodologyCode)
            para.parameterId.historicalValues = parameters.map((p: any) => {
              
              return {
                label: p.assessmentYear + ' - ' + p.value + ' ' + p.uomDataEntry,
                value: p.value,
                unit: p.uomDataEntry,
                year: p.assessmentYear
              }
            })
            let answer: any[] = [];
            para.parameterId.historicalValues.forEach((x: any) => {
              if (!answer.some(y => JSON.stringify(y) === JSON.stringify(x))) {
                answer.push(x)
              }
            })
            para.parameterId.historicalValues = answer


            para.parameterId.displayhisValues = para.parameterId.historicalValues.filter((val: { unit: any; }) => val.unit === para.parameterId.uomDataRequest)
            para.parameterId.displayhisValues.sort((a: any,b: any) => b.year - a.year);
            return para
          })
          console.log(this.parameterList)
        }
      })
      // return [];
  }

  filterParameters(parameters: any[], attr: string, value: any){
    return parameters.filter((p:any) => p[attr] === value)
  }

  onClickUpdateValue(
    parameterList: any,
    parameterValue: string,
    dataRequestId: number,
    parameterId: number,
    unit: string,
    year: string
  ) {
    this.selectedPara = parameterList
    console.log('parameterId++++', parameterId);
    if (unit){
      this.unitTypesProxy.getUnitTypes(unit ? unit : '').subscribe((res: any) => {
        this.unitTypeList = res;
        if(this.unitTypeList.length <1){
          this.unit.ur_fromUnit=unit;
          this.unitTypeList.push( this.unit)
        }
        console.log(' this.unitTypeList', this.unitTypeList);
      });
    } else {
      this.unitTypeList = []
    }
    this.selectedUnit.ur_fromUnit = unit;
    this.selectedId = dataRequestId;
    this.selectedValue = parameterValue;
    //this.selectedUnit = unit;
    this.selectedYear = year;
    this.selectedParameterId = parameterId;
    console.log('id', dataRequestId);
    this.confirm1 = true;
  }

  onClickSendNow(status: number) {
    let inputValues = new UpdateValueEnterData();
    inputValues.id = this.selectedParameterId;
    inputValues.value = this.selectedValue;
    inputValues.unitType = this.selectedUnit.ur_fromUnit;
    inputValues.assumptionParameter = this.selectedAssumption;
    if(this.isHistorical){
        inputValues.value = this.selectedHistoricalValue.value
    }
    console.log('inputValues', inputValues);
    this.parameterProxy.updateDeadline(inputValues).subscribe(
      (res) => {
        ////////////////
        let inputParameters = new UpdateDeadlineDto();
        inputParameters.ids = [this.selectedId];
        inputParameters.status = status;

        console.log('inputParameters', inputParameters);
        this.projectProxy.acceptReviewData(inputParameters).subscribe();

        //////////
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: status==5?'Successfully saved the value':'Successfully sent the value',
        });
        this.selectedValue = '';
        this.selectedAssumption = '';
        this.selectedParameter = [];
        this.onSearch();
        this.confirm1 = false;
        this.isHistorical = false;
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

  onClickSendNowAll() {
    let idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      let element = this.selectedParameters[index];
      if (
        element.parameterId?.value != null &&
        element.parameterId?.uomDataEntry != null
      ) {
        idList.push(element.id);
        console.log('element Pushed', element);
      } else {
        console.log('element', element);
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Selected parameters must have a value for unit and value.',
        });
        return;
      }
    }
    if (idList.length > 0) {
      let inputParameters = new UpdateDeadlineDto();
      inputParameters.ids = idList;
      inputParameters.status = 6;
      this.projectProxy.acceptReviewData(inputParameters).subscribe(
        (res) => {
          this.confirm1 = false;
          this.isHistorical = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully sent the Value',
          });
          this.parameterList = [];
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

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  onReject() {
    this.confirm2 = false;
  }

  onMouseOver() {
    this.isOpen = true;
  }

  onMouseleave() {
    this.isOpen = false;
  }

  getInfo(obj: any) {
    console.log('dataRequestList...', obj);
    this.paraId = obj.parameterId.id;
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

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.parameterList
      ? this.first === this.parameterList.length - this.rows
      : true;
  }

  isFirstPage(): boolean {
    return this.parameterList ? this.first === 0 : true;
  }

  search() {
    let a: any = {};
    a.rows = this.rows;
    a.first = 0;
  }

  onRejectClick(id: number) {
    this.isOpen = false;
    this.confirm2 = true;
    this.selectedDataRequestId = id;
  }
  onRejectConfirm() {
    let inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = [this.selectedDataRequestId];
    inputParameters.status =this.user_role=="Institution Admin"?DataRequestStatus.Rejected_EnterData_IA:DataRequestStatus.Rejected_EnterData_DEO;
    inputParameters.comment = this.reasonForReject;
    this.parameterRequestProxy.rejectEnterData(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data was rejected successfully',
        });
        this.confirm2 = false;

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

  paraListFilter() {
    //this.parameterListFilterData = [];

    if(this.selectedParameters)
    {

      this.parameterListFilterData = [];


      this.selectedParameters.map((e) => {
        console.log("====== selected e",e);
        let id = e.parameterId.id;
        let climateAction = e.parameterId.Assessment?.Prject?.climateActionName;
        let assesmentApproch = e.parameterId.Assessment?.assessmentType;
        let year = e.parameterId.AssessmentYear;
        let scenario = e.parameterId.isAlternative
          ? 'Alternative'
          : '' || e.parameterId.isBaseline
          ? 'Baseline'
          : '' || e.parameterId.isProject
          ? 'Project'
          : '' || e.parameterId.isLekage
          ? 'Lekage'
          : '' || e.parameterId.isProjection
          ? 'Projection'
          : '';
        let parameter = e.parameterId.name;
        let value = e.parameterId.value;
        let unit = e.parameterId.uomDataRequest;
        let deadline = e.deadline;
  
        let obj = {
          id,
          climateAction,
          assesmentApproch,
          year,
          scenario,
          parameter,
          value,
          unit,
          deadline,
        };
  
        this.parameterListFilterData.push(obj);
  
        console.log('+++++++obj 1======', obj);
      })
    }
    else {

      let n=0;
      this.parameterList.map((e) => {
        let id = e.parameterId.id;
        let climateAction = e.parameterId.Assessment?.Prject?.climateActionName;
        let assesmentApproch = e.parameterId.Assessment?.assessmentType;
        let year = e.parameterId.AssessmentYear;
        let scenario = e.parameterId.isAlternative
          ? 'Alternative'
          : '' || e.parameterId.isBaseline
          ? 'Baseline'
          : '' || e.parameterId.isProject
          ? 'Project'
          : '' || e.parameterId.isLekage
          ? 'Lekage'
          : '' || e.parameterId.isProjection
          ? 'Projection'
          : '';
        let parameter = e.parameterId.name;
        let value = e.parameterId.value;
        let unit = e.parameterId.uomDataRequest;
        let deadline = e.deadline;

        
        if(n==0){
          let obj1={
            " " :"Name",
            "":e.parameterId.Assessment?.Prject?.climateActionName,
          };
          let obj2={
            " " :"Year",
            "":e.parameterId.AssessmentYear,
          };
          let obj3={
            " " :"Scenario",
            "":e.parameterId.Assessment?.assessmentType,
          };
          this.mainParameterListFilterData.push(obj1);
          this.mainParameterListFilterData.push(obj2);
          this.mainParameterListFilterData.push(obj3);
        }
        n++;
  
        let obj = {
          id,
          climateAction,
          assesmentApproch,
          year,
          scenario,
          parameter,
          value,
          unit,
          deadline,
        };

        let objLK= {
          id,
          scenario,
          parameter,
          value,
          unit,
          deadline,
        };
  
        this.parameterListFilterDataLK.push(objLK);
        this.parameterListFilterData.push(obj);
  
        console.log('+++++++obj 2======', obj);
      });
    }
    

    
  }

  // On file Select
  onChange(event: any) {
    this.fileData = event.target.files[0];
  }

  formatDate(date: any) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (
      date.getMonth() +
      1 +
      '/' +
      date.getDate() +
      '/' +
      date.getFullYear() +
      '_' +
      strTime
    );
  }

  // OnClick of button Upload
  onUpload() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    let fullUrl = this.SERVER_URL;
    this.httpClient.post<any>(fullUrl, formData).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Excel Data Uploaded successfully',
        });

        this.myInputVariable.nativeElement.value = '';
        this.uploadFile = false;
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      }
    );
    setTimeout(() => {
      this.onSearch();
      //location.reload();
    }, 1000);
  }

  uploadDialog() {
    this.uploadFile = true;
  }

  uploadDialogCancel() {
    this.uploadFile = false;
  }

  

handleExport() {
  this.paraListFilter();

  var d = new Date();
  var reportTime = this.formatDate(d); 

if(this.country.code=="LK"){
  const headings = [[
    'ID',
    'Scenario',
    'Parameter',
    'Value',
    'Unit',
    'Deadline',
]];
  const wb = utils.book_new();
  const ws: any = utils.json_to_sheet([]);
  utils.sheet_add_json(ws, this.mainParameterListFilterData, { origin: 'A1', skipHeader: true });
  utils.sheet_add_json(ws, headings, { origin: 'A5', skipHeader: true });
  utils.sheet_add_json(ws, this.parameterListFilterDataLK, { origin: 'A6', skipHeader: true });
  utils.book_append_sheet(wb, ws, 'Report');
  writeFile(wb, 'data_entry_template_' + reportTime + '.xlsx');
}

  this.onSearch();
  this.messageService.add({
    severity: 'info',
    summary: 'Info',
    detail:
      'Please do not change the number of columns , column names  & selected units of the excel sheet if you want to re upload ',
    closable: true,
  });

  this.selectedParameters = []

}

  download() {
    this.paraListFilter();

    var d = new Date();
    var reportTime = this.formatDate(d);

    /* table id is passed over here */
    //let element = document.getElementById(this.table.nativeElement);
    //  const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(this.activeprojects);

    //  /* generate workbook and add the worksheet */
    //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    console.log(this.parameterListFilterData)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.parameterListFilterData
    );
   
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    
    console.log(ws)
    console.log(wb)
    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    XLSX.writeFile(wb, 'data_entry_template_' + reportTime + '.xlsx');

    this.onSearch();
    //
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail:
        'Please do not change the number of columns , column names  & selected units of the excel sheet if you want to re upload ',
      closable: true,
    });

    this.selectedParameters = []

    /* save to file */
    //  XLSX.writeFile(wb, this.fileName);
  }

  onHideDialog(){
    this.isHistorical = false
  }

  changeUnit(e: any, para: any, parameterId: any){
    console.log(e.value.ur_fromUnit)
    console.log(para, parameterId)
    let values = parameterId.historicalValues.filter(
      (val: any) => val.unit === e.value.ur_fromUnit
    )
    parameterId.displayhisValues = values
    parameterId.displayhisValues.sort((a: any,b: any) => b.year - a.year);
    this.selectedPara.parameterId = parameterId

  }

}
