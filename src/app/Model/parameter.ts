import {
  DefaultValue,
  Institution,
} from 'shared/service-proxies/service-proxies';

class Parameter {
  public parameterName = '';
  public isAlternativeParameter = false;
  public alternativeParameters: Parameter[] = [];
  public institution: Institution;
  public value: any;
  public UOM: any;
  public UOMList: any[] = [];

  public Code: string;

  public useDefaultValue: boolean;
  public isDefaultValue = false;

  public defaultValues: DefaultValue[] = [];
  public defaultValue: DefaultValue;

  public isHistorical = false;
  public historicalValues: any[] = [];
  public displayhisValues: any[] = [];
  public historicalValue: any;
}

export default Parameter;
