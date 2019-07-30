import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth }from "angularfire2/auth"
import {TrainingService} from "../training/training.service";
import {UIService} from "../shared/ui.service";

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isUserAuth = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService) {

  }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.auth.auth
      .createUserWithEmailAndPassword(authData.email.trim(), authData.password)
      .then()
      .catch( error=>{
        this.uiService.showSnackBar(error.message,null, {duration: 3000});
        this.uiService.loadingStateChanged.next(false);
      });
    this.uiService.loadingStateChanged.next(false);
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    this.auth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then()
      .catch( error=>{
        this.uiService.showSnackBar(error.message,null, {duration: 3000});
        this.uiService.loadingStateChanged.next(false);
      });
    this.uiService.loadingStateChanged.next(false);
  }

  logout() {
    this.auth.auth
      .signOut()
      .then()
      .catch( error=>{
        this.uiService.showSnackBar(error.message,null, {duration: 3000});
      });
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
