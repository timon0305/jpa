import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import {ArchilComponent} from './archil.component';
import { ProductsComponent } from './products/products.component';
import { CustomersComponent } from './customers/customers.component';
import { HistoryComponent } from './history/history.component';
import {
	MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule,
	MatFormFieldModule, MatIconModule,
	MatInputModule,
	MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule,
	MatTableModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';
import { PaginationModule } from "ng2-bootstrap/pagination";

@NgModule({
  declarations: [
  	ArchilComponent,
	  ProductsComponent,
	  CustomersComponent,
	  HistoryComponent,
  ],
  imports: [
    CommonModule,
	  MatButtonModule,
	  MatFormFieldModule,
	  MatTableModule,
	  MatInputModule,
	  MatPaginatorModule,
	  MatIconModule,
	  MatTooltipModule,
	  FormsModule,
	  ReactiveFormsModule,
	  MatRadioModule,
	  MatProgressSpinnerModule,
	  MatDialogModule,
	  MatSelectModule,
	  MatCheckboxModule,
	  MatCardModule,
	  MatTabsModule,
	  MatDatepickerModule,
	  Ng2TableModule,
	  RouterModule.forChild([
		  {
			  path: '',
			  component: ArchilComponent
		  }
	  ]),
	  PaginationModule.forRoot()
  ]
})
export class ArchilModule { }
