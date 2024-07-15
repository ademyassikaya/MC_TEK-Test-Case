import { Component, NgModule } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      this.authService.signup(formData).subscribe({
        next: (data: any) => {
          // Handle successful signup, navigate to login page for example
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log('Signup error:', err);
          // Handle error, maybe show user a message
        },
      });
    }
  }
}

@NgModule({
  declarations: [SignupComponent],
  imports: [ReactiveFormsModule],
  exports: [SignupComponent],
})
export class SignupModule {}
