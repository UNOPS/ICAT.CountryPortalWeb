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
import {
  AssessmentYearControllerServiceProxy,
  Country,
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

@Component({
  selector: 'app-enter-data',
  templateUrl: './enter-data.component.html',
  styleUrls: ['./enter-data.component.css'],
})
export class EnterDataComponent implements OnInit, AfterViewInit {
  climateactions: Project[] = [];
  assignCAArray: any[] = [];

  movies: any[] = [];
  country: Country;

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
  confirm1 = false;
  confirm2 = false;
  isHistorical = false;
  uploadFile = false;
  yearList: any[] = [];
  userName: string;

  loading: boolean;
  totalRecords = 0;
  rows = 10;
  last: number;
  event: any;
  user_role: string;
  searchBy: any = {
    text: null,
    climateaction: null,
    year: null,
  };
  unit: any = { ur_fromUnit: null };

  first = 0;
  paraId: number;
  requestHistoryList: any[] = [];
  displayHistory = false;
  public fileData: File;
  SERVER_URL = environment.baseUrlExcelUpload;
  isOpen = false;
  userCountryId = 0;
  userSectorId = 0;
  constructor(
    private router: Router,
    private serviceProxy: ServiceProxy,
    private parameterProxy: ParameterControllerServiceProxy,
    private projectProxy: ParameterRequestControllerServiceProxy,
    private cdr: ChangeDetectorRef,
    private assessmentYearProxy: AssessmentYearControllerServiceProxy,
    private messageService: MessageService,
    private unitTypesProxy: UnitConversionControllerServiceProxy,
    private parameterRequestProxy: ParameterRequestControllerServiceProxy,
    private prHistoryProxy: ParameterHistoryControllerServiceProxy,
    private httpClient: HttpClient,
  ) {}
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  @ViewChild('myInput')
  myInputVariable: ElementRef;

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const tokenPayload = decode<any>(token);
    this.userCountryId = tokenPayload.countryId;
    this.userSectorId = tokenPayload.sectorId;
    this.user_role = tokenPayload.roles[0];
    this.totalRecords = 0;
    this.userName = localStorage.getItem('user_name')!;

    this.serviceProxy
      .getOneBaseCountryControllerCountry(
        this.userCountryId,
        undefined,
        undefined,
        0,
      )
      .subscribe((res: any) => {
        this.country = res;
      });

    const filter2: string[] = [];

    filter2.push('projectApprovalStatus.id||$eq||' + 5);

    this.projectProxy
      .getEnterDataParameter(
        0,
        0,
        '',
        0,
        '',
        this.userName,
        environment.apiKey1,
      )
      .subscribe((res: any) => {
        for (const a of res.items) {
          if (a.parameterId.Assessment !== null) {
            if (
              !this.assignCAArray.includes(
                a.parameterId.Assessment.Prject?.climateActionName,
              )
            ) {
              this.assignCAArray.push(
                a.parameterId.Assessment.Prject?.climateActionName,
              );
              if(a.parameterId.Assessment.Prject != null){
                this.climateactions.push(a.parameterId.Assessment.Prject );
              }              
            }
          }
        }
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
      };
      reader.readAsArrayBuffer(file);
    }
  }

  onCancel() {
    this.confirm1 = false;
    this.isHistorical = false;
  }

  onCAChange(event: any) {
    if (this.searchBy.climateaction?.id != null) {
      this.assessmentYearProxy
        .getAllByProjectId(this.searchBy.climateaction?.id)
        .subscribe((res: any) => {
          this.yearList = res;
        });
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
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }

  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const climateActionId = this.searchBy.climateaction
      ? this.searchBy.climateaction.id
      : 0;
    const year = this.searchBy.year ? this.searchBy.year.assessmentYear : '';
    const filtertext = this.searchBy.text ? this.searchBy.text : '';

    const editedOn = this.searchBy.editedOn
      ? moment(this.searchBy.editedOn).format('YYYY-MM-DD')
      : '';

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    setTimeout(() => {
      this.projectProxy
        .getEnterDataParameter(
          pageNumber,
          this.rows,
          filtertext,
          climateActionId,
          year,
          this.userName,
          environment.apiKey1,
        )
        .subscribe((a) => {
          if (a) {
            this.parameterList = a.items;
            this.totalRecords = a.meta.totalItems;
            this.getHistoricalParameters(a.items);
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

    if ([...new Set(methodologyCodes)].length > 0 && [...new Set(parameterCodes)].length > 0){
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
          }
        })
    } 
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
    year: string,
  ) {
    this.selectedPara = parameterList;

    if (unit) {
      this.unitTypesProxy
        .getUnitTypes(unit ? unit : '')
        .subscribe((res: any) => {
          this.unitTypeList = res;
          if (this.unitTypeList.length < 1) {
            this.unit.ur_fromUnit = unit;
            this.unitTypeList.push(this.unit);
          }
        });
    } else {
      this.unitTypeList = [];
    }
    this.selectedUnit.ur_fromUnit = unit;
    this.selectedId = dataRequestId;
    this.selectedValue = parameterValue;
    this.selectedYear = year;
    this.selectedParameterId = parameterId;

    this.confirm1 = true;
  }

  onClickSendNow(status: number) {
    const inputValues = new UpdateValueEnterData();
    inputValues.id = this.selectedParameterId;
    inputValues.value = this.selectedValue;
    inputValues.unitType = this.selectedUnit.ur_fromUnit;
    inputValues.assumptionParameter = this.selectedAssumption;
    if (this.isHistorical) {
      inputValues.value = this.selectedHistoricalValue.value;
    }

    this.parameterProxy.updateDeadline(inputValues).subscribe(
      (res) => {
        const inputParameters = new UpdateDeadlineDto();
        inputParameters.ids = [this.selectedId];
        inputParameters.status = status;

        this.projectProxy.acceptReviewData(inputParameters).subscribe();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail:
            status == 5
              ? 'Successfully saved the value'
              : 'Successfully sent the value',
        });
        this.selectedValue = '';
        this.selectedAssumption = '';
        this.selectedParameter = [];
        this.onSearch();
        this.confirm1 = false;
        this.isHistorical = false;
        const event: any = {};
        this.loadgridData(event);
        window.location.reload()
        
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Internal server error, please try again.',
        });
      },
    );
  }

  onClickSendNowAll() {
    const idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      const element = this.selectedParameters[index];
      if (
        element.parameterId?.value != null &&
        element.parameterId?.uomDataEntry != null
      ) {
        idList.push(element.id);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Selected parameters must have a value for unit and value.',
        });
        return;
      }
    }
    if (idList.length > 0) {
      const inputParameters = new UpdateDeadlineDto();
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
        },
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
    this.paraId = obj.parameterId.id;

    this.prHistoryProxy.getHistroyByid(this.paraId).subscribe((res) => {
      this.requestHistoryList = res;
    });

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
    const a: any = {};
    a.rows = this.rows;
    a.first = 0;
  }

  onRejectClick(id: number) {
    this.isOpen = false;
    this.confirm2 = true;
    this.selectedDataRequestId = id;
  }
  onRejectConfirm() {
    const inputParameters = new UpdateDeadlineDto();
    inputParameters.ids = [this.selectedDataRequestId];
    inputParameters.status =
      this.user_role == 'Institution Admin'
        ? DataRequestStatus.Rejected_EnterData_IA
        : DataRequestStatus.Rejected_EnterData_DEO;
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
      },
    );
  }

  paraListFilter() {
    if (this.selectedParameters) {
      this.parameterListFilterData = [];
      this.selectedParameters = this.selectedParameters.filter((obj, index, array) => {
        return array.map(mapObj => mapObj.id).indexOf(obj.id) === index;
      });

      this.selectedParameters.map((e) => {
        const id = e.parameterId.id;
        const climateAction =
          e.parameterId.Assessment?.Prject?.climateActionName;
        const assessmentApproch = e.parameterId.Assessment?.assessmentType;
        const year = e.parameterId.AssessmentYear;
        const scenario = e.parameterId.isAlternative
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
        const parameter = e.parameterId.name;
        const value = e.parameterId.value;
        const unit = e.parameterId.uomDataRequest;
        const deadline = e.deadline;

        const obj = {
          id,
          climateAction,
          assessmentApproch,
          year,
          scenario,
          parameter,
          value,
          unit,
          deadline,
        };

        this.parameterListFilterData.push(obj);
      });
    } else {
      let n = 0;
      this.parameterList.map((e) => {
        const id = e.parameterId.id;
        const climateAction =
          e.parameterId.Assessment?.Prject?.climateActionName;
        const assessmentApproch = e.parameterId.Assessment?.assessmentType;
        const year = e.parameterId.AssessmentYear;
        const scenario = e.parameterId.isAlternative
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
        const parameter = e.parameterId.name;
        const value = e.parameterId.value;
        const unit = e.parameterId.uomDataRequest;
        const deadline = e.deadline;

        if (n == 0) {
          const obj1 = {
            ' ': 'Name',
            '': e.parameterId.Assessment?.Prject?.climateActionName,
          };
          const obj2 = {
            ' ': 'Year',
            '': e.parameterId.AssessmentYear,
          };
          const obj3 = {
            ' ': 'Scenario',
            '': e.parameterId.Assessment?.assessmentType,
          };
          this.mainParameterListFilterData.push(obj1);
          this.mainParameterListFilterData.push(obj2);
          this.mainParameterListFilterData.push(obj3);
        }
        n++;

        const obj = {
          id,
          climateAction,
          assessmentApproch,
          year,
          scenario,
          parameter,
          value,
          unit,
          deadline,
        };

        const objLK = {
          id,
          scenario,
          parameter,
          value,
          unit,
          deadline,
        };

        this.parameterListFilterDataLK.push(objLK);
        this.parameterListFilterData.push(obj);
      });
    }
  }

  onChange(event: any) {
    this.fileData = event.target.files[0];
  }

  formatDate(date: any) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
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

  onUpload() {
    const formData = new FormData();
    formData.append('file', this.fileData);
    const fullUrl = this.SERVER_URL;
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
      },
    );
    setTimeout(() => {
      this.onSearch();
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

    const d = new Date();
    const reportTime = this.formatDate(d);

    if (this.country.code == 'LK') {
      const headings = [
        ['ID', 'Scenario', 'Parameter', 'Value', 'Unit', 'Deadline'],
      ];
      const wb = utils.book_new();
      const ws: any = utils.json_to_sheet([]);
      utils.sheet_add_json(ws, this.mainParameterListFilterData, {
        origin: 'A1',
        skipHeader: true,
      });
      utils.sheet_add_json(ws, headings, { origin: 'A5', skipHeader: true });
      utils.sheet_add_json(ws, this.parameterListFilterDataLK, {
        origin: 'A6',
        skipHeader: true,
      });
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

    this.selectedParameters = [];
  }

  download() {
    this.paraListFilter();
    const d = new Date();
    const reportTime = this.formatDate(d);

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.parameterListFilterData,
    );

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'sheet1');

    XLSX.writeFile(wb, 'data_entry_template_' + reportTime + '.xlsx');

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

  onHideDialog(){
    this.selectedValue = '';
    this.isHistorical = false;
  }

  changeUnit(e: any, para: any, parameterId: any){
    let values = parameterId.historicalValues.filter(
      (val: any) => val.unit === e.value.ur_fromUnit
    )
    parameterId.displayhisValues = values
    parameterId.displayhisValues.sort((a: any,b: any) => b.year - a.year);
    this.selectedPara.parameterId = parameterId

  }

}
