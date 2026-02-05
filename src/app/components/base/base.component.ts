import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {
  constructor (public securityService: SecurityService , private router :Router)  {}
  isAdmin: boolean = this.securityService.hasRoleIn(['ADMIN']);
  isExpediteur: boolean = this.securityService.hasRoleIn(['Expediteur']);
  isLivreur: boolean = this.securityService.hasRoleIn(['Livreur']);

  username: string = "";

  public ngOnInit() {
    console.log(this.isAdmin);
    console.log(this.isExpediteur);
    console.log(this.isLivreur);

    if (this.securityService.profile && this.securityService.profile.username) {
      console.log(this.securityService.profile);
      this.username = this.securityService.profile.username;
    }
  }

  onLogout() {
    this.securityService.kcService.logout(window.location.origin + "/home");
  }

}