import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth }from "angularfire2/auth"
import {TrainingService} from "../training/training.service";
import {UIService} from "../shared/ui.service";
import {Store} from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import * as UI from '../shared/ui.actions';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isUserAuth = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ui: fromRoot.State}>) {

  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.auth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
      })
      .catch(error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch(new UI.StopLoading());
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }
  login(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({ type: 'START_LOADING' });
    this.auth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch({ type: 'STOP_LOADING' });
      })
      .catch(error => {
        // this.uiService.loadingStateChanged.next(false);
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.uiService.showSnackBar(error.message, null, 3000);
      });
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
