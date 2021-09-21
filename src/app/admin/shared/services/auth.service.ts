import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../../../shared/interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
    public error$: Subject<string> = new Subject<string>();

    constructor(private http: HttpClient) {
    }

    get token(): string | null {
        const expDate = new Date(localStorage.getItem('fb-token-exp'));
        if (new Date() > expDate) {
            this.logout();
            return null;
        }
        return localStorage.getItem('fb-token');
    }

    login(user: User): Observable<any> {
        user.returnSecureToken = true;
        return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user)
            .pipe(
                tap(this.setToken),
                catchError(this.errorHandler.bind(this))
            );
    }

    logout(): void {
        this.setToken(null);
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    private errorHandler(response: HttpErrorResponse): Observable<any> {
        const message = response.error.error.message;

        switch (message) {
            case 'EMAIL_NOT_FOUND':
                this.error$.next('Такой email не найден');
                break;
            case 'INVALID_EMAIL':
                this.error$.next('Неправильный email');
                break;
            case 'INVALID_PASSWORD':
                this.error$.next('Неправильный пароль');
                break;
        }

        return throwError(response);
    }

    private setToken(response: FbAuthResponse | null): void {
        if (response) {
            console.log(response);
            const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
            localStorage.setItem('fb-token', response.idToken);
            localStorage.setItem('fb-token-exp', expDate.toString());
        } else {
            localStorage.clear();
        }
    }
}
