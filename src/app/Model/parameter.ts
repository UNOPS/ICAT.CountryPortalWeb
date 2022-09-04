import {
  DefaultValue,
  Institution,
} from 'shared/service-proxies/service-proxies';

class Parameter {
  public parameterName: string = '';
  public isAlternativeParameter: boolean = false;
  public alternativeParameters: Parameter[] = [];
  public institution: Institution;
  public value: any;
  public UOM: any;
  public UOMList: any[] = [];

  public Code: string;

  public useDefaultValue: boolean;
  public isDefaultValue: boolean = false;

  public defaultValues: DefaultValue[] = [];
  public defaultValue: DefaultValue;

  public historicalValues: any[] = [];
  public displayhisValues: any[] = [];
  public historicalValue: any;

  // public isRootLevel: boolean = false;
  // public isDimentionLevel: boolean = false;
  // public isDimensionValueLevel: boolean = false;
  // public rootParameterName: string = '';
  // public dimentionName: string = '';
  // public dimensionValueName: string = '';
}

export default Parameter;
