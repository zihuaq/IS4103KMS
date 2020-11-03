import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireList } from '@angular/fire/database';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'src/app/classes/user';
import { UserService } from 'src/app/user.service';
import { SessionService } from 'src/app/session.service';
import { ChatService } from 'src/app/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})


export class ChatComponent implements OnInit {

  receiverId: number;
  users;
  messages;
  msg;
  chatMessage: string;
  sender: User;
  receiver: User;
  hasMessage = false;
  hasUsers = false;

  constructor(private sessionService: SessionService,
    private userService: UserService,
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,) { 
      this.sender = new User();
      this.receiver = new User();
    }

  ngOnInit(): void {

    this.receiverId = 2;
    this.sender = this.sessionService.getCurrentUser();

    this.users = this.chatService.getChatHistoryUser(this.sender.userId, this.sender.firstName + " " + this.sender.lastName).snapshotChanges();
    
    this.chatService.getChatHistoryUser(this.sender.userId, this.sender.firstName + " " + this.sender.lastName).valueChanges().subscribe(
      (data) => {
        if (data.length > 0) {
          this.hasUsers = true;
        }
      }
    )
  }

  postMessage() {
    this.chatService.sendMessage(this.sender, this.chatMessage, this.receiver);
    this.chatMessage = "";
  }

  loadMessage(key) {
    this.messages = this.chatService.getMessages(this.sender.userId, this.sender.firstName + " " + this.sender.lastName, key).snapshotChanges();    
    this.hasMessage = true;
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

}
