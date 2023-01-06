import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from './country';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private baseURL = "http://localhost:7080/country-profile";

  constructor(private httpClient: HttpClient) { }

  getCountryById(id: number): Observable<Country>{
    return this.httpClient.get<Country>(`${this.baseURL}/${id}`);
  }

}
