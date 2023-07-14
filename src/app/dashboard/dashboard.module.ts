import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CASADashboardComponent } from './ca-sa-dashboard/ca-sa-dashboard.component';
import { IaDashboardComponent } from './ia-dashboard/ia-dashboard.component';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { TooltipModule } from 'primeng/tooltip';
import { CarouselModule } from 'primeng/carousel';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
  declarations: [
    DashboardComponent,
    CASADashboardComponent,
    IaDashboardComponent,
  ],
  imports: [
    CommonModule,
    ChartModule,
    TableModule,
    ChartModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    CarouselModule,
    MessagesModule,
    MessageModule,
  ],
})
export class DashboardModule {}
