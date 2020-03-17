import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {observable, Observable, of} from 'rxjs';
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
// const BASE_URL = 'http://208.73.232.176:8082/api/v1/';
// const BASE_URL = 'http://127.0.0.1:8082/api/v1/';
const BASE_URL = 'http://51.15.67.111:8082/api/v1/';

@Injectable()
export class AuthService {
    constructor(private http: HttpClient) {}
    // Authentication/Authorization
    login(email: string, password: string): Observable<Object> {
        return this.http.post(BASE_URL + 'session/login', { 'username': email, 'password': password });
    }

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

    // getProductsData
	getProductsData(oauthToken): Observable<Object> {
		let httpHeaders = new HttpHeaders();
		httpHeaders = httpHeaders.set('Authorization', 'Bearer ' + oauthToken);
		httpHeaders = httpHeaders.set('Content-Type', 'application/json');

		console.log(httpHeaders.get('Authorization'));
    	return this.http.get(BASE_URL + 'product', {headers: httpHeaders})
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
    	return this.http.get(BASE_URL + 'product/search?start='+sDate+'&end='+eDate, {headers: httpHeaders})
	}

	//getCustomerData
	getCustomerData(oauthToken): Observable<Object> {
    	let httpHeaders = new HttpHeaders();
    	httpHeaders = httpHeaders.set('Authorization', 'Bearer' + oauthToken);
    	httpHeaders = httpHeaders.set('Content-Type', 'application/json');

    	return this.http.get(BASE_URL + 'customer', {headers: httpHeaders})
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
		return this.http.get(BASE_URL + 'customer/search?start='+sDate+'&end='+eDate, {headers: httpHeaders})
	}

	//getHistoryData
	getHistoryData(oauthToken): Observable<Object> {
    	let httpHeaders = new HttpHeaders();
    	httpHeaders = httpHeaders.set('Authorization', 'Bearer' + oauthToken);
    	httpHeaders = httpHeaders.set('Content-Type', 'application/json');

    	return this.http.get(BASE_URL + 'history', {headers: httpHeaders})
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
		return this.http.get(BASE_URL + 'history/search?start='+sDate+'&end='+eDate, {headers: httpHeaders})
	}


    public requestPassword(email: string): Observable<any> {
    	return this.http.get(API_USERS_URL + '/forgot?=' + email)
    		.pipe(catchError(this.handleError('forgot-password', []))
	    );
    }


    getAllUsers(): Observable<User[]> {
		return this.http.get<User[]>(API_USERS_URL);
    }

    getUserById(userId: number): Observable<User> {
		return this.http.get<User>(API_USERS_URL + `/${userId}`);
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

    getRolePermissions(roleId: number): Observable<Permission[]> {
        return this.http.get<Permission[]>(API_PERMISSION_URL + '/getRolePermission?=' + roleId);
    }

    // Roles
    getAllRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(API_ROLES_URL);
    }

    getRoleById(roleId: number): Observable<Role> {
		return this.http.get<Role>(API_ROLES_URL + `/${roleId}`);
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

    // Check Role Before deletion
    isRoleAssignedToUsers(roleId: number): Observable<boolean> {
        return this.http.get<boolean>(API_ROLES_URL + '/checkIsRollAssignedToUser?roleId=' + roleId);
    }

    findRoles(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        // This code imitates server calls
        const httpHeaders = new HttpHeaders();
        httpHeaders.set('Content-Type', 'application/json');
		      return this.http.post<QueryResultsModel>(API_ROLES_URL + '/findRoles', queryParams, { headers: httpHeaders});
	}

 	/*
 	 * Handle Http operation that failed.
 	 * Let the app continue.
     *
	 * @param operation - name of the operation that failed
 	 * @param result - optional value to return as the observable result
 	 */
    private handleError<T>(operation = 'operation', result?: any) {
        return (error: any): Observable<any> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
