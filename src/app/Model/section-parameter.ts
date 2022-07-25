import Parameter from './parameter';

class SectionParameter {
  public parameterHeader: string = '';
  public parameters: Parameter[] = [];

  public route: string = '';
  public vehical: string = '';
  public fuel: string = '';
  public powerPlant: string = '';
  public feedstock: string = '';
  public soil: string = '';
  public stratum: string = '';
  public residue: string = '';
  public landClearance:string = '';
}

export default SectionParameter;
