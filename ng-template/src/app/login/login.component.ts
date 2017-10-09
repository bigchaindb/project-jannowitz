import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../shared/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public isBusy = false

  constructor(private router: Router, private authService: AuthService) { }

  onSubmit(f: NgForm) {
    // this.isBusy = true
    // const id = f.value.id
    // this.authService.login(id).then(authResponse => {
    //   this.isBusy = false
    //   if (authResponse.result) {
    //     this.router.navigate([`/dashboard/${authResponse.context}`])
    //   }
    // }).catch(() => this.isBusy = false)
  }

  ngOnInit() { }
}
