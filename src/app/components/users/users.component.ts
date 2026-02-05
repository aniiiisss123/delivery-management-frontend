import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  searchQuery: string = '';
  searchCriteria: string = 'username';
  showAddForm: boolean = false;
  isLivreur: boolean = false;
  userForm!: FormGroup;
  Profile = Profile;
  selectedUser: User | null = null;

  newUser: User = {
    userId: undefined,
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: undefined,
    gouvernorat:'',
    adresse:'',
    datebirth: new Date(),
    typeUser: undefined,
    pricePerKm:undefined,
    cin:undefined,
    type:undefined,
    marque:undefined
  };

  constructor(
    private userService: UsersService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getAllUsers();
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      gouvernorat: ['', Validators.required],
      adresse: ['', Validators.required],
      datebirth: ['', Validators.required],
      typeUser: ['', Validators.required],
      pricePerKm: ['', [Validators.min(0.5), Validators.max(1)]],
      cin: ['',Validators.pattern('^[0-9]{8}$')],
      type: [''],
       marque: [''],
      
    });
  
    this.userForm.get('typeUser')?.valueChanges.subscribe(value => {
      this.isLivreur = value === Profile.Livreur;
      if (this.isLivreur) {
        this.userForm.get('pricePerKm')?.setValidators([Validators.required, Validators.min(0.5), Validators.max(1)]);
        this.userForm.get('type')?.setValidators(Validators.required);
        this.userForm.get('marque')?.setValidators(Validators.required);
      } else {
        this.userForm.get('pricePerKm')?.clearValidators();
        this.userForm.get('type')?.clearValidators();
        this.userForm.get('marque')?.clearValidators();
      }
      this.userForm.get('pricePerKm')?.updateValueAndValidity();
      this.userForm.get('type')?.updateValueAndValidity();
      this.userForm.get('marque')?.updateValueAndValidity();
    });
  }
  getAllUsers(): void {
    this.userService.getAllUsers().subscribe(users => {
      this.users = users;
      this.filteredUsers = users;
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markAllAsTouched();
      console.log('Invalid form');
      return;
    }
    const userData: User = {
      ...this.userForm.value,
     

    };

    this.userService.addUser(userData).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/users');
      alert('Utilisateur ajouté avec succès');
      this.initForm();
      this.getAllUsers();
  
    }, error => {
      console.error(error);
    });
  }

  filterUsers(): void {
    if (!this.searchQuery) {
      this.filteredUsers = this.users;
      return;
    }

    if (this.searchCriteria === 'username') {
      this.userService.getUserByUsername(this.searchQuery).subscribe(user => {
        this.filteredUsers = user ? [user] : [];
      });
    } else if (this.searchCriteria === 'typeUser') {
      this.userService.getUserByTypeUser(this.searchQuery).subscribe(users => {
        this.filteredUsers = users;
      });
    }
  }

  deleteUser(id: number | undefined): void {
    if (id) {
      this.userService.deleteUser(id).subscribe(() => {
        console.log("User deleted");
        this.getAllUsers();
      });
    }
  }

  onChangeTypeUser(event: any): void {
    this.isLivreur = event.target.value === Profile.Livreur;
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
  }

  cancelEdit(): void {
    this.selectedUser = null;
  }


  editUser(user: User): void {
    this.selectedUser = user;
    this.isLivreur = user.typeUser === Profile.Livreur;
    this.userForm.patchValue(user);  // Patch the user values to the form
   
      this.showAddForm = false;
    
  }
  
  saveUser(): void {
    if (this.selectedUser) {
      
        const updatedUser: User = {
            ...this.selectedUser,
            ...this.userForm.value,
            userId: this.selectedUser.userId
        };

        console.log('Updating user:', updatedUser);

        this.userService.updateUser(updatedUser).subscribe(
            (response) => {
                console.log('User updated successfully:', response);
                this.selectedUser = null;
                this.getAllUsers(); // Refresh the list of users
                this.showAddForm = false;
            },
            (error) => {
                console.error('Error updating user:', error);
            }
        );
    }
}

  
  openMap(): void {
    const addressControl = this.userForm.get('adresse');
    if (addressControl) {
      const currentAddress = addressControl.value;
      this.router.navigate(['/map'], { state: { currentAddress } });
    }
  }


  markAllAsTouched(): void {
    Object.keys(this.userForm.controls).forEach(field => {
      const control = this.userForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
