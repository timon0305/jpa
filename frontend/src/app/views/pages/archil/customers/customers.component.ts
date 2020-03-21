import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/auth/_services';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'kt-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})

export class CustomersComponent implements OnInit {

	public rows:Array<any> = [];
	public columns:Array<any> = [];
	public page:number = 1;
	public itemsPerPage:number = 10;
	public maxSize:number = 5;
	public numPages:number = 1;
	public length:number = 0;

	public config:any = {
		paging: true,
		sorting: {columns: this.columns},
		filtering: {filterString: ''},
		className: ['table-striped', 'table-bordered']
	};

	public data = [];

	// Start Date and End Date Validation
	unavailability = { startDate:"", endDate: "" };
	unavailabilityForm: FormGroup;
	constructor(
		private getUserService: AuthService,
		private formBuilder: FormBuilder,
		private ref: ChangeDetectorRef)
	{
		// Pagination Definition.
		this.length = this.data.length;
		// Start Date and End Date Validation
		this.unavailabilityForm = this.formBuilder.group({
			startDate: [this.unavailability.startDate],
			endDate: [this.unavailability.endDate]
		});
	}

	oauthToken: string;
	refreshToken: string;
	public ngOnInit():void {
		// Get Token
		this.oauthToken = localStorage.getItem('oauthToken');
		this.refreshToken = localStorage.getItem('refreshToken');

		this.getUserService.getCustomerData(this.oauthToken).subscribe( result => {
			let columns = [];
			let i = 0;
			Object.keys(result['rows'][0][0]).forEach(item => {
				let temp = {};
				temp['title'] = item.toLocaleUpperCase();
				temp['name'] = item;
				temp['sort'] = '';
				temp['sort'] = '';
				if(i > 0 && i < 5) {
					temp['filtering'] = {'filterString':'', 'placeholder': 'By ' + item.toLocaleLowerCase()};
				}
				i ++;
				columns.push(temp)
			});
			this.columns = columns;

			// Draw Body
			this.data = result['rows'][0];
			this.onChangeTable(this.config);
		});
	}

	public changePage(page:any, data:Array<any> = this.data):Array<any> {
		let start = (page.page - 1) * page.itemsPerPage;
		let end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
		return data.slice(start, end);
	}

	public changeSort(data:any, config:any):any {
		if (!config.sorting) {
			return data;
		}

		let columns = this.config.sorting.columns || [];
		let columnName:string = void 0;
		let sort:string = void 0;

		for (let i = 0; i < columns.length; i++) {
			if (columns[i].sort !== '' && columns[i].sort !== false) {
				columnName = columns[i].name;
				sort = columns[i].sort;
			}
		}

		if (!columnName) {
			return data;
		}

		// simple sorting
		return data.sort((previous:any, current:any) => {
			if (previous[columnName] > current[columnName]) {
				return sort === 'desc' ? -1 : 1;
			} else if (previous[columnName] < current[columnName]) {
				return sort === 'asc' ? -1 : 1;
			}
			return 0;
		});
	}

	public changeFilter(data:any, config:any):any {
		let filteredData:Array<any> = data;
		this.columns.forEach((column:any) => {
			if (column.filtering) {
				// console.log(column.filtering);
				filteredData = filteredData.filter((item:any) => {
					return item[column.name].match(column.filtering.filterString);
				});
			}
		});

		if (!config.filtering) {
			return filteredData;
		}

		if (config.filtering.columnName) {
			return filteredData.filter((item:any) =>
				item[config.filtering.columnName].match(this.config.filtering.filterString));
		}

		let tempArray:Array<any> = [];
		filteredData.forEach((item:any) => {
			let flag = false;
			this.columns.forEach((column:any) => {
				if (item[column.name].toString().match(this.config.filtering.filterString)) {
					flag = true;
				}
			});
			if (flag) {
				tempArray.push(item);
			}
		});
		filteredData = tempArray;

		return filteredData;
	}

	public onChangeTable(config:any, page:any = {page: this.page, itemsPerPage: this.itemsPerPage}):any {
		if (config.filtering) {
			Object.assign(this.config.filtering, config.filtering);
		}

		if (config.sorting) {
			Object.assign(this.config.sorting, config.sorting);
		}

		let filteredData = this.changeFilter(this.data, this.config);
		let sortedData = this.changeSort(filteredData, this.config);
		this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
		this.length = sortedData.length;
	}

	public onCellClick(data: any): any {
		console.log(data);
	}

	// Get Local Time
	private _getDateString(source: string): string {
		let ret = '';
		let datePart = source.split(', ')[0].toString();
		if (source && source.length >= 8 && datePart.length >= 8) {
			let month = datePart.split('/')[0];
			if (month.length === 1) month = `0${month}`;
			let date = datePart.split('/')[1];
			if (date.length === 1) date = `0${date}`;
			let year = datePart.split('/')[2];
			ret = `${year}-${month}-${date}`;
		}
		return ret;
	}

	// Start Date and End Date Filter and Submit
	onSubmit() {
		let start_date = this.unavailabilityForm.controls.startDate.value;
		start_date = start_date ? start_date.toLocaleString() : '';
		let end_date = this.unavailabilityForm.controls.endDate.value;
		end_date = end_date ? end_date.toLocaleString() : '';
		start_date = this._getDateString(start_date);
		end_date = this._getDateString(end_date);
		if (start_date === '') start_date = '0000-00-00';
		if (end_date === '') end_date = '9999-12-31';

		let search = {'oauth': this.oauthToken, 'sDate': start_date, 'eDate': end_date};
		console.log(search);
		this.getUserService.customerSearch(search).subscribe(result => {
			this.data = result['rows'][0];
			this.onChangeTable(this.config);
			this.ref.detectChanges();
		});

	}
}
