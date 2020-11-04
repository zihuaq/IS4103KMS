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
    private activatedRoute: ActivatedRoute,) { 
      this.sender = new User();
      this.receiver = new User();
      this.messages = [];
      this.allUsers = [];
      this.userIdList = [];
      this.filteredUsers = [];
    }

  ngOnInit(): void {

    this.userService.getAllUsers().subscribe(
      response => {
        this.allUsers = response;
        this.filteredUsers = this.allUsers;
      }
    );

    this.sender = this.sessionService.getCurrentUser();

    this.users = this.chatService.getChatHistoryUser(this.sender.userId, this.sender.firstName + " " + this.sender.lastName).snapshotChanges();    
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
    )    
  }

  postMessage() {
    this.chatService.sendMessage(this.sender, this.chatMessage, this.receiver);
    this.chatMessage = "";
  }

  loadMessage(key) {
    this.isNewChat = false;
    this.selectedUser = key;
    // this.messages = this.chatService.getMessages(this.sender.userId, this.sender.firstName + " " + this.sender.lastName, key).snapshotChanges();    
    this.chatService.getMessages(this.sender.userId, this.sender.firstName + " " + this.sender.lastName, key).valueChanges().subscribe(
      (data) => {
        this.messages = data;
        this.hasMessage = true;
      }
    )
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

  // handleSearchStringChanged(event) {
  //   this.filteredUsers = [];
  //   this.searchString = event + "";
  //   if (this.searchString && this.searchString != "") {
  //     this.allUsers.forEach((user) => {
  //       if (this.userMatchSearchString(user)) {
  //         this.filteredUsers.push(user);
  //       }
  //     })
  //   } else {
  //     this.filteredUsers = this.allUsers;
  //     console.log(this.allUsers)
  //   }
    
  // }

  // userMatchSearchString(user: User) {
  //   if (user.userType == UserType.INDIVIDUAL || user.userType == UserType.ADMIN) {
  //     if (!user.firstName.toLowerCase().includes(this.searchString.toLowerCase()) &&
  //       !user.lastName.toLowerCase().includes(this.searchString.toLowerCase())) {
  //       return false;
  //     }
  //   } else if (user.userType == UserType.INSTITUTE) {
  //     if (!user.firstName.toLowerCase().includes(this.searchString.toLowerCase())) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }


}

