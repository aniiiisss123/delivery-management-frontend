import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) { }

  onSubmit() {
    if (this.username === 'your_username' && this.password === 'your_password') {
      console.log('Login successful!');
    } else {
      console.error('Invalid username or password. Please try again.');
    }
  }
  navigateToHome() {
    this.router.navigateByUrl('/home');
  }
  navigateToform() {
    this.router.navigateByUrl('/registration');
  }
  
}
