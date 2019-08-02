import {Component, OnInit} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {UIService} from "../../shared/ui.service";
import {Observable} from "rxjs";
import * as fromRoot from "../../app.reducer";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<{ui: fromRoot.State}>) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit(form: NgForm) {
    this.authService.login({
      email: form.value.email.trim(),
      password: form.value.password.trim()
    });
  }
}
