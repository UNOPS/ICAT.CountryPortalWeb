import { Component, Input, OnInit } from '@angular/core';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import {
  AssessmentYear,
  Parameter,
  VerificationControllerServiceProxy,
  VerificationDetail,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-raise-concern-section',
  templateUrl: './raise-concern-section.component.html',
  styleUrls: ['./raise-concern-section.component.css'],
})
export class RaiseConcernSectionComponent implements OnInit {
  @Input()
  area: string;

  @Input()
  verificationDetails: VerificationDetail[] | undefined;

  @Input()
  assesmentYear: AssessmentYear;

  @Input()
  verificationRound: number;

  @Input()
  parameter: Parameter;

  lastConcernDate: Date = new Date();
  verificationStatusEnum = VerificationStatus;

  commentRequried: boolean = false;
  comment: string = '';

  verificationDetail: VerificationDetail | undefined;
  explanation: string = '';

  constructor(
    private verificationProxy: VerificationControllerServiceProxy,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: any) {
    this.commentRequried = false;
    this.comment = '';

    if (this.verificationDetails && this.verificationDetails.length > 0) {
      let concernDetails = this.verificationDetails.find(
        (a) => a.explanation !== undefined && a.explanation !== null
      );

      if (concernDetails && concernDetails.updatedDate !== undefined) {
        this.lastConcernDate = concernDetails.updatedDate.toDate();
      }

      this.verificationDetail = this.verificationDetails.find(
        (a) => a.verificationStage == this.verificationRound
      );

      if (this.verificationDetail) {
        this.comment = this.verificationDetail.explanation;
      }
    }
  }
}
