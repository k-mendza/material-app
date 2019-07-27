import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth }from "angularfire2/auth"
import {TrainingService} from "../training/training.service";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isUserAuth = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService) {

  }

  registerUser(authData: AuthData) {
    this.auth.auth.createUserWithEmailAndPassword(authData.email.trim(), authData.password);
  }

  login(authData: AuthData) {
    this.auth.auth.signInWithEmailAndPassword(authData.email.trim(), authData.password);
  }

  logout() {
    this.auth.auth.signOut();
  }

  isAuth() {
    return this.isUserAuth;
  }

  initAuthListener() {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.isUserAuth = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.isUserAuth = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
        this.trainingService.cancelSubscriptions();
      }
    })
  }
}
