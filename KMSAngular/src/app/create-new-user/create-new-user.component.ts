import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.css']
})
export class CreateNewUserComponent implements OnInit {
  newUser: User;

  constructor(private userService: UserService) { 
    this.newUser = new User;
  }

  ngOnInit(): void {
  }

  onCreateUser(userRegistrationForm: NgForm){
    console.log(userRegistrationForm);
    if(userRegistrationForm.valid){
      this.newUser.firstName = userRegistrationForm.value.firstName
      this.newUser.lastName = userRegistrationForm.value.lastName
      this.newUser.email = userRegistrationForm.value.email
      this.newUser.password = userRegistrationForm.value.password
      this.userService.userRegistration(this.newUser).subscribe(responsedata => {
        console.log(responsedata)
      })
    }
  }

  // customerRegistration(customerRegistrationForm: NgForm) {
  //   this.submitted = true;

  //   if (customerRegistrationForm.valid) {
  //     this.customerService.customerRegistration(this.newCustomer).subscribe(
  //       response => {
  //         let newCustomerId: number = response.newCustomerId;
  //         if (newCustomerId != null) {
  //           this.registrationError = false;
  //           this.displayRegistrationSuccessModal = true;
  //         } else {
  //           this.registrationError = true;
  //           this.errorMessage = "Null customer error";
  //         }
  //       }, error => {
  //         this.registrationError = true;
  //         console.log('********** CustomerRegistrationComponent.ts customerRegistration(): ' + error);
  //         this.errorMessage = "Error: " + error.slice(37);
  //       }
  //     );
  //   }
  // }

}
