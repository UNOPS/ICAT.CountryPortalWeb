import { Component, Input, OnInit } from '@angular/core';
import { VerificationStatus } from 'app/Model/VerificationStatus.enum';
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
  assessmentYear: AssessmentYear;

  @Input()
  verificationRound: number;

  @Input()
  parameter: Parameter;

  lastConcernDate: Date = new Date();
  verificationStatusEnum = VerificationStatus;

  commentRequried = false;
  comment = '';

  verificationDetail: VerificationDetail | undefined;
  explanation = '';

  constructor(
    private verificationProxy: VerificationControllerServiceProxy,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {}

  ngOnChanges(changes: any) {
    this.commentRequried = false;
    this.comment = '';

    if (this.verificationDetails && this.verificationDetails.length > 0) {
      const concernDetails = this.verificationDetails.find(
        (a) => a.explanation !== undefined && a.explanation !== null,
      );

      if (concernDetails && concernDetails.updatedDate !== undefined) {
        this.lastConcernDate = concernDetails.updatedDate.toDate();
      }

      this.verificationDetail = this.verificationDetails.find(
        (a) => a.verificationStage == this.verificationRound,
      );

      if (this.verificationDetail) {
        this.comment = this.verificationDetail.explanation;
      }
    }
  }
}
