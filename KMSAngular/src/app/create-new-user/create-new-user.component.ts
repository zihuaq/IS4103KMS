import { Component, OnInit, inject, Inject, LOCALE_ID } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../classes/user';

@Component({
  selector: 'app-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.css'],
})
export class CreateNewUserComponent implements OnInit {
  newUser: User;
  maxDate = new Date().toISOString().slice(0,10);
  genders = ['male', 'female'];

  constructor(private userService: UserService) {
    this.newUser = new User();
  }

  ngOnInit(): void {}

  onCreateUser(userRegistrationForm: NgForm) {
    console.log(userRegistrationForm);
    if(userRegistrationForm.valid){
      this.newUser.firstName = userRegistrationForm.value.firstName
      this.newUser.lastName = userRegistrationForm.value.lastName
      this.newUser.email = userRegistrationForm.value.email
      this.newUser.dob = userRegistrationForm.value.dob
      this.newUser.gender = userRegistrationForm.value.gender
      this.newUser.password = userRegistrationForm.value.password
      this.newUser.joinedDate = new Date()
      this.newUser.isAdmin = false
      console.log(this.newUser)
      this.userService.userRegistration(this.newUser).subscribe(responsedata => {
        console.log(responsedata)
      })
    }
  }
}
