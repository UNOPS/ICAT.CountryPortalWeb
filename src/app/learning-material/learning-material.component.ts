import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  LearningMaterialControllerServiceProxy,
  LearningMaterial,
} from 'shared/service-proxies/service-proxies';

@Component({
  selector: 'app-learning-material',
  templateUrl: './learning-material.component.html',
  styleUrls: ['./learning-material.component.css']
})
export class LearningMaterialComponent implements OnInit, AfterViewInit {

  learnigMaterials: LearningMaterial[];
  lm: any;
  ug: any;
  sortOrder: number = 1;
  sortType: number = 0;
  event: any;
  searchBy: any = {
    text: null,
    sortOption: '',
  };

  sortOptions = [
    { name: 'BY DATE -> DESC' },
    { name: 'BY DATE -> ASC' },
    { name: 'BY DOCUMENT NAME -> DESC' },
    { name: 'BY DOCUMENT NAME -> ASC' },
  ];

  userTypeId: number = 0; // should dynamically add after login system develop
  sectorId: number = 0; // should dynamically add after login system develop
  constructor(
    private LearningMaterialProxy: LearningMaterialControllerServiceProxy,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.loadgridData();
  }

  onSearch() {
    this.loadgridData();
  }

  onStatusChange(event: any) {
    this.onSearch();

  }


  loadgridData = () => {
    if (this.searchBy.sortOption.name == 'BY DATE -> DESC') {
      this.sortOrder = 0;
      this.sortType = 0;
    }
    if (this.searchBy.sortOption.name == 'BY DATE -> ASC') {
      this.sortOrder = 1;
      this.sortType = 0;
    }
    if (this.searchBy.sortOption.name == 'BY DOCUMENT NAME -> DESC') {
      this.sortOrder = 0;
      this.sortType = 1;
    }
    if (this.searchBy.sortOption.name == 'BY DOCUMENT NAME -> ASC') {
      this.sortOrder = 1;
      this.sortType = 1;
    }

    let filtertext = this.searchBy.text ? this.searchBy.text : '';

    let pageNumber = 1;
    let rows = 1000;
    setTimeout(() => {
      this.LearningMaterialProxy.getLearningMaterialDetails(
        pageNumber,
        rows,
        filtertext,
        this.sortOrder,
        this.sortType,

      )
        .subscribe((a) => {
          this.learnigMaterials = a.items;
          this.lm = this.learnigMaterials.filter((o: any) => o.documentType == 'Learning Material');
          this.ug = this.learnigMaterials.filter((o: any) => o.documentType == 'User Guidence');

        });
    }, 1);
  };

}
