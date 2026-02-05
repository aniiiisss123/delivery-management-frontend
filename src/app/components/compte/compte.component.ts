import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { UsersService } from '../../services/users.service';

import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.component.html',
  styleUrls: ['./compte.component.css']
})
export class CompteComponent implements OnInit {
  @Input() user: User = { 
    username: '', 
    firstname: '', 
    lastname: '', 
    email: '', 
    phone: 0, 
    gouvernorat:'',
    adresse: '', 
    datebirth: new Date(), 
    pricePerKm: 0, 
    type:'',
    marque:'',
    userId: 0 
  };

  isEditing: boolean = false;
  username!: string; 
  isLivreur: boolean = false;

  constructor(private usersService: UsersService, private securityservice: SecurityService) { }

  ngOnInit(): void {
    if (this.securityservice.profile && this.securityservice.profile.username) {
      this.username = this.securityservice.profile.username;
      this.getUserDetails();
      this.isLivreur = this.securityservice.hasRoleIn(['Livreur']);
    }
  }

  getUserDetails() {
    this.usersService.getUserByUsername(this.username).subscribe((user: User) => {
      this.user = user;
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveUser() {
    this.usersService.updateUser(this.user).subscribe(() => {
      this.toggleEdit();
    });
  }
  confirmDelete() {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      this.deleteUser(this.user.userId);
    }
  }

  deleteUser(id: number | undefined): void {
    if (id) {
      this.usersService.deleteUser(id).subscribe(() => {
        console.log("User deleted");
        this.securityservice.kcService.logout(window.location.origin + "/home");

      });
    }
  }

  cancelEdit() {
    this.isEditing = !this.isEditing;
  }
}
