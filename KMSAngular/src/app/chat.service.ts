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

  getChatHistoryUser(senderId: number, senderName: string) {
    return this.db.list(senderId + "_" + senderName, ref => {
      return ref.orderByChild("timeStamp");
    });
  }

  getMessages(sender: User, receiver: string) {
    return this.db.list(sender.userId + "_" + sender.firstName + " " + sender.lastName + "/" + receiver, ref => {
      return ref.orderByChild("timeStamp");
    });
  }

  sendMessage(sender: User, message: string, receiver: User) {

    this.db.list(sender.userId + "_" + sender.firstName + " " + sender.lastName + "/" + receiver.userId + "_" + receiver.firstName + " " + receiver.lastName).push(
      {
        'senderId': sender.userId,
        'senderName': sender.firstName + " " + sender.lastName,
        'receiverId': receiver.userId, 
        'receiverName': receiver.firstName + " " + receiver.lastName,
        'msg': message, 
        'timeStamp': new Date().getTime()
      }
    ).then(
      () => {
        this.db.list(receiver.userId + "_" + receiver.firstName + " " + receiver.lastName + "/" + sender.userId + "_" + sender.firstName + " " + sender.lastName).push(
          {
            'senderId': sender.userId,
            'senderName': sender.firstName + " " + sender.lastName,
            'receiverId': receiver.userId, 
            'receiverName': receiver.firstName + " " + receiver.lastName,
            'msg': message, 
            'timeStamp': new Date().getTime()
          }
        );
      }
    )
    
    this.db.list(sender.userId + "_" + sender.firstName + " " + sender.lastName).update(
      receiver.userId + "_" + receiver.firstName + " " + receiver.lastName, { 'timeStamp': new Date().getTime() }
    )
    this.db.list(receiver.userId + "_" + receiver.firstName + " " + receiver.lastName).update(
      sender.userId + "_" + sender.firstName + " " + sender.lastName, { 'timeStamp': new Date().getTime() }
    )
  }

  createChat(sender: User, message: string,receiver: User) {
    this.sendMessage(sender, message,receiver);
    this.db.list(sender.userId + "_" + sender.firstName + " " + sender.lastName).update(
      receiver.userId + "_" + receiver.firstName + " " + receiver.lastName, { 'userId': receiver.userId }
    )
    this.db.list(receiver.userId + "_" + receiver.firstName + " " + receiver.lastName).update(
      sender.userId + "_" + sender.firstName + " " + sender.lastName, { 'userId': sender.userId }
    ) 
  }


}
