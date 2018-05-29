import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.createForm();
  }

  public onSubmit() {
    console.log(this.loginForm.value);

    this.router.navigate(['/']);
  }

  private createForm() {
    this.loginForm = this.formBuilder.group({
      email: '',
    });
  }
}
