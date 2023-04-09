import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Nationality, Ip, Country } from 'src/app/Interfaces/interface';
import { SingupFormGroup } from 'src/app/Interfaces/signUpForm';

import { MyApisService } from 'src/app/services/my-apis.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private service: MyApisService,
    private route: Router
  ) {}

  allCountries$: Observable<Country[]> = this.service.getAllCountries();
  hide = true;
  hideConfirm = true;
  signForm!: FormGroup<SingupFormGroup>;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.getIpWithGeoLocation();
    this.createForm();
  }
  createForm(): void {
    this.signForm = this.fb.group(
      {
        username: [
          '',
          [Validators.required, Validators.pattern('[A-Za-z0-9s]+$')],
        ],
        nationality: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              `^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]*$`
            ),
            Validators.minLength(8),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              `^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?]*$`
            ),
            Validators.minLength(8),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        ipAddress: ['', Validators.required],
      },
      { validators: this.checkPassword }
    );
  }
  checkPassword: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notmatch: true };
  };
  signUp(): void {
    localStorage.setItem('user', this.signForm.value?.username);
    this.route.navigate(['/welcome']);
  }
  getIpWithGeoLocation(): void {
    const sub$ = this.service.getIpWithGeoLocation().subscribe({
      next: (res: { ip: Ip; nationality: Nationality }) => {
        this.signForm.patchValue({
          ipAddress: res?.ip?.ip,
          nationality: res?.nationality?.country_name,
        });
      },
      error: (error) => console.log(error.message),
    });
    this.subscriptions.push(sub$);
  }

  get passwordErrorMessage(): string {
    const control: AbstractControl = this.signForm.get('password');
    return control.hasError('pattern')
      ? 'password must use English char and special char only'
      : control.hasError('minlength')
      ? 'min length 8 char'
      : 'password  required';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
