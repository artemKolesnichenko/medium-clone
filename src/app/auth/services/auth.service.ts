import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';
import { RegisterRequestInterface } from '../types/registerRequest.interface';
import { HttpClient } from '@angular/common/http';
import { AuthResponseInterface } from '../types/authResponse.interface';
import { LoginRequestInterface } from '../types/loginRequest.interface';
@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  getUser(response: AuthResponseInterface): CurrentUserInterface {
    return response.user;
  }

  register(data: RegisterRequestInterface): Observable<CurrentUserInterface> {
    const url = 'http://localhost:3000/api/users';

    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map(this.getUser));
  }

  login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
    const url = 'http://localhost:3000/api/users/login';

    return this.http
      .post<AuthResponseInterface>(url, data)
      .pipe(map(this.getUser));
  }
}
