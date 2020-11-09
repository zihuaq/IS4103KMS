import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireList } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { UserType } from '../classes/user-type.enum';
import { UserService } from 'src/app/user.service';
import { SessionService } from 'src/app/session.service';
import { ChatService } from 'src/app/chat.service';
import { Notification } from 'src/app/classes/notification';
import { NotificationService } from 'src/app/notification.service';

declare var $: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})


export class ChatComponent implements OnInit {

  @Input() searchModel;
  @Output() searchModelChange: EventEmitter<any> = new EventEmitter();
  
  receiverId: number;
  users;
  messages;
  msg;
  chatMessage: string;
  sender: User;
  receiver: User;
  hasMessage = false;
  hasUsers = false;
  selectedUser;
  allUsers: User[];
  userIdList;
  isNewChat = false;
  newChatUser;
  searchString: string;
  filteredUsers: User[];

  constructor(private sessionService: SessionService,
    private userService: UserService,
    private chatService: ChatService,
    private notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,) { 
      this.sender = new User();
      this.receiver = new User();
      this.messages = [];
      this.allUsers = [];
      this.userIdList = [];
      this.filteredUsers = [];
      this.users = [];
    }

  ngOnInit(): void {

    this.userService.getAllUsers().subscribe(
      response => {
        this.allUsers = response;
        this.filteredUsers = this.allUsers;
      }
    );

    this.sender = this.sessionService.getCurrentUser();
    
    this.chatService.getChatHistoryUser(this.sender.userId, this.sender.firstName + " " + this.sender.lastName).valueChanges().subscribe(
      (data) => {   
        this.userIdList = [];
        let list: any[] = data;
        if (list.length > 0) {
          this.hasUsers = true;
        } 
        for (let a of list) {
          this.userIdList.push(a.userId);
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
        console.log(this.users.length)
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

  ngOnDestroy() {
    console.log("chat component: ngOnDestroy()")
    this.loadMessage("");
  }

  postMessage() {
    this.chatService.sendMessage(this.sender, this.chatMessage, this.receiver);
    this.chatMessage = "";

    this.notificationService.getNewNotification(this.receiver.userId).subscribe(
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
          newNotification.date = new Date();
          newNotification.msg = "You have new message(s)";
          newNotification.projectId = null;
          newNotification.groupId = null;
          newNotification.hasRead = false;
          this.notificationService.createNewNotification(newNotification, this.receiver.userId).subscribe();
        }
      }
    );
    console.log("test")
  }

  loadMessage(key) {
    this.isNewChat = false;
    this.selectedUser = key;   

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
          if (user.key == key) {
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
        
      }
    );

    for (let user of this.users) {
      if (user.key == key) {
        this.hasMessage = true;
        let m = user.data;
        for (let x in m) {          
          if (x != 'userId' && x !='timeStamp' && x != 'count') {
            this.chatService.readMessage(this.sender, key, x);
          } 
        }
        break;
      }
    }
    
    let id = this.getUserIdFromKey(key);
    this.userService.getUser(id).subscribe(
      response => {
        this.receiver = response;
      }
    );
  }

  getUserIdFromKey(key) {
    let index = key.indexOf("_");
    return key.substring(0, index);
  }

  getNameFromKey(key) {
    let index = key.indexOf("_");
    return key.substring(index + 1);
  }

  hasChatHistory(user) {
    if (user.userId == this.sender.userId) {
      return true;
    }
    for (let id of this.userIdList) {
      if (user.userId == id) {
        return true;
      }
    }
    return false;
  }

  newChat(user) {
    this.selectedUser = "";
    this.isNewChat = true;
    this.newChatUser = user;
    this.userService.getUser(this.newChatUser.userId).subscribe(
      response => {
        this.receiver = response;
      }
    );
    $('#userListModalCloseBtn').click();
  }

  sendMessageToNewChat() {
    this.isNewChat = false;
    this.chatService.createChat(this.sender, this.chatMessage, this.receiver);
    this.chatMessage = "";
    let name = this.receiver.userId + "_" + this.receiver.firstName + " " + this.receiver.lastName;
    this.loadMessage(name);
    this.userIdList.push(this.receiver.userId);
  }

  updateSearchModel(value) {
    this.searchModel = value;
    this.searchModelChange.emit(this.searchModel);
  }

}

