class ParameterDimensionSelection {
  public vehical: any = '';
  public vehicals: any = [];

  public oneFuel: any = '';
  public fuel: any = [];

  public oneRoute: any = '';
  public route: any = [];

  public oneFeedstock: any = '';
  public feedstock: any = [];
 
  public oneSoil: any = '';
  public soil: any = [];
 
  public oneResidue: any = '';
  public residue: any = [];

  public oneStratum: any = '';
  public stratum: any = [];

  public onelandClearance: any = '';
  public landClearance: any = [];
 


  public powerPlan: any = '';

  public newVehical: string = '';
  public newFuel: string = '';
  public newFeedstock: string = '';
  public newSoil: string = '';
  public newResidue: string = '';
  public newLandClearance: string = '';




  public canAddVehical: boolean = false;
  public canAddFuel: boolean = false;
  public canAddFeedstock: boolean = false;
  public canAddSoil: boolean = false;
  public canAddResidue: boolean = false;
  public canAddLandClearance: boolean = false;
  

  createNew(): ParameterDimensionSelection {
    let emptydi = new ParameterDimensionSelection();
    return emptydi;
  }
}

export default ParameterDimensionSelection;
