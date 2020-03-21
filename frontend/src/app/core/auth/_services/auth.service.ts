import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { User } from '../_models/user.model';
import { Permission } from '../_models/permission.model';
import { Role } from '../_models/role.model';
import { catchError, map } from 'rxjs/operators';
import { QueryParamsModel, QueryResultsModel } from '../../_base/crud';
import { environment } from '../../../../environments/environment';
//import Any = jasmine.Any;

const API_USERS_URL = 'api/users';
const API_PERMISSION_URL = 'api/permissions';
const API_ROLES_URL = 'api/roles';
// const BASE_URL = 'http://127.0.0.1:8082/api/v1/';
const BASE_URL = 'http://51.15.67.111:8082/api/v1/';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}
    // Authentication/Authorization
    login(email: string, password: string): Observable<Object> {
        return this.http.post(BASE_URL + 'session/login', { 'username': email, 'password': password });
    }
    // getProductsData
	getProductsData(oauthToken): Observable<Object> {
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + oauthToken);
		httpHeaders = httpHeaders.set('Content-Type', 'application/json');

    	return this.http.post(BASE_URL + 'product/list', {"page": 0, "pageSize": 1000}, {headers: httpHeaders})
			.pipe(
				map((res: any) => {
					return res;
				}),
				catchError(err => {
					return null;
				})
			);
	}

	// Product Search with Start Date and End Date
	productSearch(search): Observable<Object> {
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + search['oauth']);
		httpHeaders = httpHeaders.set('Content-Type', 'application/json');
    	let sDate = search['sDate'];
    	let eDate = search['eDate'];
    	return this.http.post(BASE_URL + 'product/list',
			{
				"page": 0,
				"pageSize": 1000,
				"dateRange": {
					"startDate": sDate,
					"endDate": eDate
				}},{headers: httpHeaders})
	}

	//getCustomerData
	getCustomerData(oauthToken): Observable<Object> {
    	let httpHeaders = new HttpHeaders();
    	httpHeaders = httpHeaders.set('Authorization', 'Bearer' + oauthToken);
    	httpHeaders = httpHeaders.set('Content-Type', 'application/json');

    	return this.http.post(BASE_URL + 'customer/list',{"page": 0, "pageSize": 1000}, {headers: httpHeaders})
			.pipe(
				map((res: any) => {
					return res;
				}),
				catchError(err => {
					return null;
				})
			);
	}
	// Customer Search with Start Date and End Date
	customerSearch(search): Observable<Object> {
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + search['oauth']);
		httpHeaders = httpHeaders.set('Content-Type', 'application/json');
		let sDate = search['sDate'];
		let eDate = search['eDate'];
		return this.http.post(BASE_URL + 'customer/list',
			{
				"page": 0,
				"pageSize": 1000,
				"dateRange": {
					"startDate": sDate,
					"endDate": eDate
				}},{headers: httpHeaders})
	}

	//getHistoryData
	getHistoryData(oauthToken): Observable<Object> {
    	let httpHeaders = new HttpHeaders();
    	httpHeaders = httpHeaders.set('Authorization', 'Bearer' + oauthToken);
    	httpHeaders = httpHeaders.set('Content-Type', 'application/json');

    	return this.http.post(BASE_URL + 'history/list',{"page": 0, "pageSize": 1000}, {headers: httpHeaders})
			.pipe(
				map((res: any) => {
					return res;
				}),
				catchError(err => {
					return null
				})
			);
	}
	// History Search with Start Date and End Date
	historySearch(search): Observable<Object> {
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + search['oauth']);
		httpHeaders = httpHeaders.set('Content-Type', 'application/json');
		let sDate = search['sDate'];
		let eDate = search['eDate'];
		return this.http.post(BASE_URL + 'history/list',
			{
				"page": 0,
				"pageSize": 1000,
				"dateRange": {
					"startDate": sDate,
					"endDate": eDate
				}},{headers: httpHeaders})
	}


    public requestPassword(email: string): Observable<any> {
    	return this.http.get(API_USERS_URL + '/forgot?=' + email)
    		.pipe(catchError(this.handleError('forgot-password', []))
	    );
    }



	// Get Token Info..
	getUserByToken(): Observable<User> {
		const userToken = localStorage.getItem(environment.authTokenKey);
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Authorization', 'Bearer ' + userToken);
		return this.http.get<User>(API_USERS_URL, { headers: httpHeaders });
	}

	register(user: User): Observable<any> {
		const httpHeaders = new HttpHeaders();
		httpHeaders.set('Content-Type', 'application/json');
		return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders })
			.pipe(
				map((res: User) => {
					return res;
				}),
				catchError(err => {
					return null;
				})
			);
	}
    // DELETE => delete the user from the server
	deleteUser(userId: number) {
		const url = `${API_USERS_URL}/${userId}`;
		return this.http.delete(url);
    }

    // UPDATE => PUT: update the user on the server
	updateUser(_user: User): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.put(API_USERS_URL, _user, { headers: httpHeaders });
	}

    // CREATE =>  POST: add a new user to the server
	createUser(user: User): Observable<User> {
    	const httpHeaders = new HttpHeaders();
     httpHeaders.set('Content-Type', 'application/json');
		   return this.http.post<User>(API_USERS_URL, user, { headers: httpHeaders});
	}

    // Method from server should return QueryResultsModel(items: any[], totalsCount: number)
	// items => filtered/sorted result
	findUsers(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.post<QueryResultsModel>(API_USERS_URL + '/findUsers', queryParams, { headers: httpHeaders});
    }

    // Permission
    getAllPermissions(): Observable<Permission[]> {
		return this.http.get<Permission[]>(API_PERMISSION_URL);
    }


    // Roles
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(API_ROLES_URL);
    }

    // CREATE =>  POST: add a new role to the server
	createRole(role: Role): Observable<Role> {
		// Note: Add headers if needed (tokens/bearer)
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.post<Role>(API_ROLES_URL, role, { headers: httpHeaders});
	}

    // UPDATE => PUT: update the role on the server
	updateRole(role: Role): Observable<any> {
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.put(API_ROLES_URL, role, { headers: httpHeaders });
	}

	// DELETE => delete the role from the server
	deleteRole(roleId: number): Observable<Role> {
		const url = `${API_ROLES_URL}/${roleId}`;
		return this.http.delete<Role>(url);
	}


    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, { headers: httpHeaders});
	}

    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
