import {
  AssessmentYearControllerServiceProxy,
  DataVerifierDto,
  UsersControllerServiceProxy,
} from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AssessmentYear } from 'shared/service-proxies/service-proxies';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';

@Component({
  selector: 'app-assign-verifiers',
  templateUrl: './assign-verifiers.component.html',
  styleUrls: ['./assign-verifiers.component.css'],
})
export class AssignVerifiersComponent implements OnInit {
  VerificationStatusEnum = VerificationStatus;
  verificationStatus: string[] = [];
  assesMentYearId = 0;
  assessmentYear: AssessmentYear = new AssessmentYear();
  parameters: any[] = [];
  loading = false;
  confirm1: boolean;
  userList: any[] = [];
  selectedUser: any;
  selectedDeadline: Date;
  reasonForReject: string;
  minDate: Date;
  selectedParameters: any[] = [];
  totalRecords = 0;
  rows = 10;
  last: number;
  searchBy: any = {
    text: null,
    status: null,
  };

  constructor(
    private assessmentProxy: AssessmentYearControllerServiceProxy,
    private messageService: MessageService,
    private usersControllerServiceProxy: UsersControllerServiceProxy,
  ) {}

  ngOnInit(): void {
    const event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.usersControllerServiceProxy
      .allUserDetails(1, 1000, '', 2)
      .subscribe((res: any) => {
        res.items.forEach((ra:any)=>{
          if(ra.status==0){
            this.userList.push(ra);
          }
        });
        this.totalRecords = res.totalRecords;
      });
  }
  onSearch() {
    let event: any = {};
    event.rows = this.rows;
    event.first = 0;

    this.loadgridData(event);
  }
  onStatusChange($event: any) {
    this.onSearch();
  }
  loadgridData = (event: LazyLoadEvent) => {
    this.loading = true;
    this.totalRecords = 0;

    const pageNumber =
      event.first === 0 || event.first === undefined
        ? 1
        : event.first / (event.rows === undefined ? 1 : event.rows) + 1;
    this.rows = event.rows === undefined ? 10 : event.rows;

    const statusId = this.searchBy.status
      ? Number(VerificationStatus[this.searchBy.status])
      : 0;

    const filtertext = this.searchBy.text ? this.searchBy.text : '';

    setTimeout(() => {
      this.assessmentProxy
        .getAssessmentForAssignVerifiers(
          pageNumber,
          this.rows,
          statusId,
          filtertext,
        )
        .subscribe((a) => {
          if (a) {
            this.parameters = a.items;
            this.totalRecords = a.meta.totalItems;
            const uniqueStatus = [
              ...new Set(a.items.map((obj: any) => obj.verificationStatus)),
            ];

            this.verificationStatus = [];
            uniqueStatus.forEach((element) => {
              this.verificationStatus.push(
                this.VerificationStatusEnum[Number(element)],
              );
            });
          }
          this.loading = false;
        });
    }, 1);
  };

  onAcceptClick() {
    if (this.selectedParameters.length > 0) {
      this.confirm1 = true;
    }
  }

  onAcceptConfirm() {
    const idList = new Array<number>();
    for (let index = 0; index < this.selectedParameters.length; index++) {
      const element = this.selectedParameters[index];
      idList.push(element.id);
    }

    const inputParameters = new DataVerifierDto();
    inputParameters.ids = idList;
    inputParameters.userId = this.selectedUser?.id;
    inputParameters.deadline = moment(this.selectedDeadline);
    this.assessmentProxy.updateAssignVerifiers(inputParameters).subscribe(
      (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Data verifiers asssigned successfully',
        });
        this.selectedParameters = [];
        this.selectedUser = '';
        this.onSearch();
      },
      (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error.',
          detail: 'Can not Assign Data verifiers, please try again.',
        });
      },
    );
    this.confirm1 = false;
  }

  onCancelConfirm() {
    this.confirm1 = false;
  }
}
