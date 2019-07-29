import {Component, OnDestroy, OnInit} from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import {UIService} from "../../shared/ui.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  private loadingSub: Subscription;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private uiService: UIService) { }

  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
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

  ngOnDestroy() {
    this.loadingSub.unsubscribe();
  }
}
