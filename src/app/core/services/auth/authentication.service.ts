import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Login } from '../../models/authentication/login';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TokenStorageService } from './token-storage.service';
import { Result } from '../../models/helpers/result';
import { AccessData } from '../../models/authentication/access-data';
import { AuthService } from 'ngx-auth';
import { Register } from '../../models/authentication/register';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements AuthService {
	private apiUrl: string = environment.apiUrl + "/api/auth";
	constructor(private http: HttpClient,
		private tokenStorage: TokenStorageService,
	//	private alertService: AlertService,
		private router: Router,
		private navCtrl: NavController) { }

  login(login: Login): Observable<Result> {
	   
		return this.http.post<Result>(this.apiUrl + "/login", login).pipe(
			map((result: Result) => {
				if (result instanceof Array) {
					return result.pop();
				}
				return result;
			}),
			tap(this.saveAccessData.bind(this)),
			catchError(err => {
				return throwError(err);
			})
		);
	}

  
	logout(refresh?: boolean): void {
		this.tokenStorage.clear();
		if (refresh) {
			/*this.alertService.presentAlert('Atenção!', 'Sua sessão foi expirada. Faça o login novamente!')
				.then(() => {
				  //location.reload(true);
				  this.navCtrl.navigateRoot('/auth/login');
				})
			return;*/
		}
		//location.reload(true);
		this.navCtrl.navigateRoot('/auth/login');
	}

  /**
 * Function, that should perform refresh token verifyTokenRequest
 * @description Should be successfully completed so interceptor
 * can execute pending requests or retry original one
 * @returns {Observable<any>}
 */

	refreshToken(): Observable<Result> {
		return this.tokenStorage.getRefreshToken()
			.pipe(
				switchMap((refreshToken: string) => {
					const _login: Login = new Login();
					_login.grantType = "refresh_token";
					_login.refreshToken = refreshToken;
					return this.http.post<any>(this.apiUrl + "/login", _login)
				}),
				map((result: any) => {
					console.log(result)
					if (result instanceof Array) {
						return result.pop();
					}
					return result;
				}),
				tap(this.saveAccessData.bind(this)),
				catchError(err => {
					this.logout(true);
					return throwError(err);
				})
			);
	}

	isAuthorized(): Observable<boolean> {
		return this.tokenStorage.getAccessToken().pipe(map(token => !!token));
	}

	/**
 * Get access token
 * @description Should return access token in Observable from e.g. localStorage
 * @returns {Observable<string>}
 */
	getAccessToken(): Observable<string> {
		return this.tokenStorage.getAccessToken();
	}


	/**
	 * Function, checks response of failed request to determine,
	 * whether token be refreshed or not.
	 * @description Essentialy checks status
	 * @param {Response} response
	 * @returns {boolean}
	 */
	refreshShouldHappen(response: HttpErrorResponse): boolean {
		return response.status === 401;
	}

	verifyTokenRequest(url: string): boolean {
		return url.endsWith("refresh");
	}

  postRegister(register: Register): Observable<Result> {
		return this.http.post<Result>(this.apiUrl + '/register', register).pipe(
			map((result: Result) => {
				return result;
			}),
			catchError(err => {
				return throwError(err);
			})
		);

	}



  private saveAccessData(accessData: AccessData) {
		if (typeof accessData !== 'undefined') {
			this.tokenStorage
				.setAccessToken(accessData.accessToken)
				.setCreated(accessData.created)
				.setExpiration(accessData.expiration)
				.setRefreshToken(accessData.refreshToken)
		}
	}
}


