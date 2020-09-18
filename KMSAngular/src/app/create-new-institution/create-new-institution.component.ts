import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../classes/user';
import { UserType } from '../classes/user-type.enum';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-new-institution',
  templateUrl: './create-new-institution.component.html',
  styleUrls: ['./create-new-institution.component.css']
})
export class CreateNewInstitutionComponent implements OnInit {

  newUser: User;
  maxDate = new Date().toISOString().slice(0,10);
  genders = ['male', 'female'];
  accountCreated = false;
  accountCreationError = false;
  errorMessage: string;
  successMessage = "Account Created successfully an verification email has been sent."
  isLoading = false;

  constructor(private userService: UserService) {
    this.newUser = new User();
  }

  ngOnInit(): void {}

  onCreateUser(userRegistrationForm: NgForm) {
    console.log(userRegistrationForm);
    if(userRegistrationForm.valid){
      this.newUser.firstName = userRegistrationForm.value.istitutionName
      // this.newUser.lastName = userRegistrationForm.value.lastName
      this.newUser.email = userRegistrationForm.value.email
      // let dobDate = new Date(userRegistrationForm.value.dob)
      // this.newUser.dob = dobDate
      // this.newUser.gender = userRegistrationForm.value.gender
      this.newUser.password = userRegistrationForm.value.password
      this.newUser.joinedDate = new Date()
      this.newUser.userType = UserType.INSTITUTE
      console.log(this.newUser)
      this.isLoading = true;
      this.userService.userRegistration(this.newUser).subscribe(responsedata => {
        console.log(responsedata)
        this.isLoading = false;
        this.accountCreated = true;
        this.accountCreationError = false;
      }, error => {
        this.isLoading = false;
        this.accountCreated = false;
        this.accountCreationError = true;
        this.errorMessage = 'Error: ' + error;
      })
    }
  }

}
