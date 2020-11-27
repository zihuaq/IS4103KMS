import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalController } from "@ionic/angular";

import { NewChatPage } from './new-chat/new-chat.page';

import { User } from '../../classes/user';
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  sender: User;
  users;
  hasUsers: boolean = false;
  hasLoad: boolean = false;

  constructor(private authenticationService: AuthenticationService,
    private userService: UserService,
    private chatService: ChatService,
    private location: Location,
    private router: Router,
    public modalController: ModalController) {
      this.sender = new User();
      this.users = [];
     }

  ngOnInit() {

    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.sender = user;

        this.chatService.getChatHistoryUser(this.sender.userId, this.sender.firstName + " " + this.sender.lastName).valueChanges().subscribe(
          (data) => {   
            let list: any[] = data;
            this.hasLoad = true;
            if (list.length > 0) {
              this.hasUsers = true;
            } 
          }
        );
    
        this.chatService.getChatHistoryUser(this.sender.userId, this.sender.firstName + " " + this.sender.lastName).snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ key: c.payload.key, data: c.payload.val() })
            )
          )
        ).subscribe(
          data => {
            let msgs = [];
            let count = 0;
            this.users = data;
            for (let user of this.users) {          
              let m = user.data;
              for (let x in m) {
                count = 0;
                if (m.hasOwnProperty(x)) {
                  if (x != 'userId' && x != 'timeStamp' && x != 'count') {
                    msgs.push(m[x]);
                  }
                }
                msgs.sort((a, b) => (a.timeStamp < b.timeStamp ? 1 : a.timeStamp > b.timeStamp ? -1 : 0))
                for (let i = 0; i < msgs.length; i++) {
                  if (msgs[i].senderId != this.sender.userId) {
                    if (!msgs[i].hasRead) {
                      count++;              
                    } else {
                      break;
                    }
                  }              
                }            
              }
              this.chatService.updateUnreadCount(this.sender, user.key, count);
            }
          }
        );
      }
    );
  }

  getNameFromKey(key) {
    let index = key.indexOf("_");
    return key.substring(index + 1);
  }

  viewChat(user) {
    this.router.navigate(['messages/' + user.key]);
  }

  goBack() {
    this.location.back()
  }

  async newChat() {
    const modal = await this.modalController.create({
      component: NewChatPage,
    });
    return await modal.present();
  }

}
