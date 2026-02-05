import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { SecurityService } from 'src/app/services/security.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private router: Router, public kcService: KeycloakService) { }

  navigateToform() {
    this.router.navigateByUrl('/registration');
  }
  async navigateTo() {
    await this.kcService.login({
    });
}
  }
