import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TagRequest } from 'src/app/classes/tag-request';
import { TagType } from 'src/app/classes/tag-type.enum';
import { TagService } from 'src/app/tag.service';

declare var $: any;

@Component({
  selector: 'app-handle-tag-requests',
  templateUrl: './handle-tag-requests.component.html',
  styleUrls: ['./handle-tag-requests.component.css']
})
export class HandleTagRequestsComponent implements OnInit {
  tagRequests: TagRequest[];
  TagType = TagType;
  reqToHandle: TagRequest;
  
  // @Output() tagsChanged = new EventEmitter<void>();

  constructor(public tagService: TagService) { }

  ngOnInit(): void {
    this.updateTagRequests();
  }

  updateTagRequests() {
    this.tagService.getTagRequests().subscribe(
      (result) => {
        this.tagRequests = result;
      })
  }

  setRequestToHandle(tagRequest: TagRequest) {
    this.reqToHandle = tagRequest;
  }

  onRejectRequest() {
    this.tagService.rejectTagRequest(this.reqToHandle.tagRequestId).subscribe(
      (response) => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Tag Request Rejected!',
        });
        this.updateTagRequests();
      },
      (error) => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      });
  }

  onAcceptRequest() {
    this.tagService.acceptTagRequest(this.reqToHandle.tagRequestId).subscribe(
      (response) => {
        $(document).Toasts('create', {
          class: 'bg-success',
          title: 'Success',
          autohide: true,
          delay: 2500,
          body: 'Tag Request Accepted!',
        });
        this.updateTagRequests();
        // this.tagsChanged.emit();
      },
      (error) => {
        $(document).Toasts('create', {
          class: 'bg-danger',
          title: 'Error',
          autohide: true,
          delay: 2500,
          body: error,
        });
      });
  }
}
