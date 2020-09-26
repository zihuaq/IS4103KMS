import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-account-verification',
  templateUrl: './account-verification.component.html',
  styleUrls: ['./account-verification.component.css']
})
export class AccountVerificationComponent implements OnInit {
  userEmail: String;
  userUUID: String;
  verified = false;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit(): void {
    console.log("Entered acc Verification")
    this.userEmail = this.route.snapshot.params['email'];
    this.userUUID = this.route.snapshot.params['uuid'];
    this.userService.verifyEmail(this.userEmail,this.userUUID).subscribe((respose) => {
      this.verified = respose;
    }, (error) => {
      console.log('********** accountVerification.ts ngOnInit ' + error);
      })

  }

}
