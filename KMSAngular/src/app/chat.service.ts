import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';

import { User } from 'src/app/classes/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private db: AngularFireDatabase,
    private firestore: AngularFirestore) { 
    }

  getChatHistoryUser(senderName: string) {
    return this.db.list(senderName);
  }

  getMessages(senderName: string, receiverName: string) {
    return this.db.list(senderName + "/" + receiverName, ref => {
      return ref.orderByChild("timeStamp");
    });
  }

  sendMessage(sender: User, message: string, receiver: User) {

    this.db.list(sender.firstName + " " + sender.lastName + "/" + receiver.firstName + " " + receiver.lastName).push({
      'senderId': sender.userId,
      'senderName': sender.firstName + " " + sender.lastName,
      'receiverId': receiver.userId, 
      'receiverName': receiver.firstName + " " + receiver.lastName,
      'msg': message, 
      'timeStamp': new Date().getTime()
    }).then(
      () => {
        this.db.list(receiver.firstName + " " + receiver.lastName + "/" + sender.firstName + " " + sender.lastName).push({
          'senderId': sender.userId,
          'senderName': sender.firstName + " " + sender.lastName,
          'receiverId': receiver.userId, 
          'receiverName': receiver.firstName + " " + receiver.lastName,
          'msg': message, 
          'timeStamp': new Date().getTime()
        });
      }
    )

    
  }


}
