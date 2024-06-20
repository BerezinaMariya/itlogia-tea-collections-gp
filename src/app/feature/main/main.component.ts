import {Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Subscription, timer} from "rxjs";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private subscription: Subscription | null = null;

  @ViewChild('popup')
  popup!: TemplateRef<ElementRef>;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.subscription = timer(10000).subscribe(() => {
      this.modalService.open(this.popup, { centered: true });
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
