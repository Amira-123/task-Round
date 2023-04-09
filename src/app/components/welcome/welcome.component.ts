import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  username: string = '';
  constructor() {}

  ngOnInit(): void {
    this.getUserName();
  }
  getUserName(): string {
    if (localStorage.getItem('user')) {
      this.username = localStorage.getItem('user');
    } else {
      return 'none';
    }
  }
}
