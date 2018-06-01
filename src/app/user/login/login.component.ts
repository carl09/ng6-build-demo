import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginAction, StateProxyService } from 'state';

@Component({
  selector: 'app-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: StateProxyService,
  ) {
    this.createForm();
  }

  public onSubmit() {
    console.log(this.loginForm.value);

    this.store.dispatch(
      new LoginAction({
        username: this.loginForm.value['email'],
      }),
    );

    this.router.navigate(['/products']);
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: '',
    });
  }
}
