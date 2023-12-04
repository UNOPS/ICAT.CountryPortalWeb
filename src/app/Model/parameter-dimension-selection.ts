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

  public newVehical = '';
  public newFuel = '';
  public newFeedstock = '';
  public newSoil = '';
  public newResidue = '';
  public newLandClearance = '';

  public canAddVehical = false;
  public canAddFuel = false;
  public canAddFeedstock = false;
  public canAddSoil = false;
  public canAddResidue = false;
  public canAddLandClearance = false;

  createNew(): ParameterDimensionSelection {
    const emptydi = new ParameterDimensionSelection();
    return emptydi;
  }
}

export default ParameterDimensionSelection;
