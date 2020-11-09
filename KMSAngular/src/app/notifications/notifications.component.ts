import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Notification } from '../classes/notification';
import { NotificationService } from '../notification.service';
import { SessionService } from '../session.service';

declare var $: any;

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  userId: number;
  notifications: Notification[];

  constructor(public sessionService: SessionService,
    private notificationService: NotificationService,
    private router: Router) { 
      this.notifications = [];
    }

  ngOnInit(): void {
    this.userId = this.sessionService.getCurrentUser().userId;

    this.notificationService.getNotification(this.userId).subscribe(
      response => {
        this.notifications = response;
        this.notifications.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
      }
    );
  }

  clickNotification(notification: Notification) {
    this.notificationService.readNotification(notification.notificationId).subscribe(
      response => {
        if (notification.groupId == null && notification.projectId == null) {
          this.router.navigate(['/chat']);
        }
        
        if (notification.projectId != null) {
          this.router.navigate(['projectDetails/' + notification.projectId]);
        }
    
        if (notification.groupId != null) {
          this.router.navigate(['groupDetails/' + notification.groupId]);
        }
      }, 
      error => {
        $(document).Toasts('create', {
          class: 'bg-error',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      }
    );
  }

}
