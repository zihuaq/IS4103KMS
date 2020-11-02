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

  constructor(private sessionService: SessionService,
    private userService: UserService,
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,) { 
      this.sender = new User();
      this.receiver = new User();
    }

  ngOnInit(): void {
    this.receiverId = parseInt(this.activatedRoute.snapshot.paramMap.get("userId"));
    this.sender = this.sessionService.getCurrentUser();

    this.users = this.chatService.getChatHistoryUser(this.sender.firstName + " " + this.sender.lastName).snapshotChanges();

    

    this.userService.getUser(this.receiverId.toString()).subscribe(
      response => {
        this.receiver = response;
        this.messages = this.chatService.getMessages(this.sender.firstName + " " + this.sender.lastName, this.receiver.firstName + " " + this.receiver.lastName).snapshotChanges();
      }
    );
    
  }

  postMessage() {
    this.chatService.sendMessage(this.sender, this.chatMessage, this.receiver);
  }

}
