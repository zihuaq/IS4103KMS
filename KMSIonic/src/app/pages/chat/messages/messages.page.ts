import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';

import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/services/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ChatService } from 'src/app/services/chat.service';
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  @ViewChild('content') content:any;
  messages;
  chatMessage: string;
  sender: User;
  receiver: User;
  receiverKey: string;
  hasMessage = false;
  users;

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private chatService: ChatService,
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.receiverKey = this.activatedRoute.snapshot.paramMap.get('user');

    this.userService.getUser(this.getUserIdFromKey(this.receiverKey)).subscribe(
      response => {
        this.receiver = response;
      }
    )

    this.authenticationService.getCurrentUser().then(
      (user: User) => {
        this.sender = user;

        this.chatService.getChatHistoryUser(this.sender.userId, this.sender.firstName + " " + this.sender.lastName).snapshotChanges().pipe(
          map(changes =>
            changes.map(c =>
              ({ key: c.payload.key, data: c.payload.val() })
            )
          )
        ).subscribe(
          data => {
            this.users = data;
            this.messages = [];
            for (let user of this.users) {
              if (user.key == this.receiverKey) {
                this.hasMessage = true;
                let m = user.data;
                for (let x in m) {
                  if (m.hasOwnProperty(x)) {
                    if (x != 'userId' && x !='timeStamp' && x != 'count') {
                      this.messages.push(m[x]);
                    }                
                  }
                }
                this.messages.sort((a, b) => (a.timeStamp > b.timeStamp ? 1 : a.timeStamp < b.timeStamp ? -1 : 0))
                break;
              }
            }
            for (let user of this.users) {
              if (user.key == this.receiverKey) {
                this.hasMessage = true;
                let m = user.data;
                for (let x in m) {          
                  if (x != 'userId' && x !='timeStamp' && x != 'count') {
                    this.chatService.readMessage(this.sender, this.receiverKey, x);
                  } 
                }
                break;
              }
            }
          }
        );   
      }
    )
  }

  ionViewDidEnter(){
    this.content.scrollToBottom(30);
  }

  getUserIdFromKey(key) {
    let index = key.indexOf("_");
    return key.substring(0, index);
  }

  getNameFromKey(key) {
    let index = key.indexOf("_");
    return key.substring(index + 1);
  }

  goBack() {
    this.location.back();
  }

  postMessage() {
    this.chatService.sendMessage(this.sender, this.chatMessage, this.receiver);
    this.chatMessage = "";

    this.notificationService.getNotification(this.receiver.userId).subscribe(
      response => {
        let hasMsgNotification = false;
        let notifications = response;
        for (let n of notifications) {
          if (n.projectId == null && n.groupId == null) {
            hasMsgNotification = true;
            break;
          }
        }
        if (!hasMsgNotification) {
          let newNotification = new Notification();
          newNotification.msg = "You have new message(s)";
          newNotification.projectId = null;
          newNotification.groupId = null;
          this.notificationService.createNewNotification(newNotification, this.receiver.userId).subscribe();
        }
      }
    );

    this.chatService.getChatHistoryUser(this.receiver.userId, this.receiver.firstName + " " + this.receiver.lastName).snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, data: c.payload.val() })
        )
      )
    ).subscribe(
      data => {
        this.content.scrollToBottom(30);
        let msgs = [];
        let count = 0;
        let userList: any[] = data;
        for (let user of userList) {          
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
              if (msgs[i].receiver != this.receiver.userId) {
                if (!msgs[i].hasRead) {
                  count++;              
                } else {
                  break;
                }
              }              
            }            
          }
          this.chatService.updateUnreadCount(this.receiver, user.key, count);
        }
      }
    );
  }

}
