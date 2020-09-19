import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  requestSent = false;
  isLoading = false;
  requestSentError = false;
  errorMessage: string;
  successMessage = "New password sent please check your email"

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  getNewPassword(forgotPasswordForm: NgForm) {
    console.log(forgotPasswordForm);
    if(forgotPasswordForm.valid){
      let email: String = forgotPasswordForm.value.email
      this.isLoading = true;
      this.userService.resetPassword(email).subscribe((Response) => {
        this.isLoading = false;
        this.requestSent = true;
        this.requestSentError = false;
      }, error => {
        this.isLoading = false;
        this.errorMessage = "There was an error sending the request, make sure your email address is correct."
        this.requestSentError = true;
        this.requestSent = false;
      })

    }
  }

}
