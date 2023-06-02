import { Injectable } from "@angular/core";
import { AssessmentYear, AssessmentYearControllerServiceProxy } from "./service-proxies/service-proxies";
import { VerificationStatus } from "app/Model/VerificationStatus.enum";

@Injectable()
export class VerificationService {

    constructor(
        private assessmentYearControllerServiceProxy: AssessmentYearControllerServiceProxy
    ) { }

    async checkVerificationStage(assessmentYear: AssessmentYear) {
        let roundOneHeadTable
        let roundTwoHeadTable 
        let roundThreeHeadTable
        if (assessmentYear.assessment.id) {
            let verificationList = (await this.assessmentYearControllerServiceProxy
                .getVerificationDeatilsByAssessmentIdAndAssessmentYear(assessmentYear.assessment.id, assessmentYear.assessmentYear)
                .toPromise())[0]?.verificationDetail;
            roundOneHeadTable = verificationList?.find((o: any) => o.verificationStage == 1);
            roundTwoHeadTable = verificationList?.find((o: any) => o.verificationStage == 2);
            roundThreeHeadTable = verificationList?.find((o: any) => o.verificationStage == 3);
        }

        return {
            roundOneHeadTable: roundOneHeadTable,
            roundTwoHeadTable: roundTwoHeadTable,
            roundThreeHeadTable: roundThreeHeadTable
        }
        
    }

    checkStatus(verificationStatus: any){
        let status = [
          VerificationStatus.Fail, VerificationStatus['In Remediation'], VerificationStatus['NC Recieved'],
          VerificationStatus.Pass
        ]
    
        return !status.includes(parseInt(verificationStatus))
      }
}