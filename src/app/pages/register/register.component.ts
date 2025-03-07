import AOS from 'aos';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  RxReactiveFormsModule,
  updateOn,
} from '@rxweb/reactive-form-validators'; // <-- #2 import module
import { AuthService } from '../../core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    FormsModule,
    RxReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private readonly id = inject(PLATFORM_ID);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  registerForm!: FormGroup;
  isLoading: WritableSignal<boolean> = signal(false);
  msgError: WritableSignal<string> = signal('');
  registerUnsubscribe: Subscription = new Subscription();

  ngOnInit(): void {
    this.aosInit();
    this.RegisterFormInit();
  }

  aosInit() {
    if (isPlatformBrowser(this.id)) {
      AOS.init();
    }
  }

  RegisterFormInit() {
    this.registerForm = this.formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[\W_]).{8,}$/),
          ],
        ],

        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ],
        ],

        rePassword: [''],

        dateOfBirth: ['', Validators.required],

        gender: ['', Validators.required],
      },
      {
        validator: this.checkPassword,
        updateOn: 'submit',
      }
    );
  }

  checkPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;
    return password === rePassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.registerUnsubscribe = this.authService
        .signup(this.registerForm.value)
        .subscribe({
          next: (res) => {
            if (res.message == 'success') {
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 500);
            }
            this.isLoading.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.msgError.set(err.error.error);
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.registerUnsubscribe.unsubscribe();
  }
}
