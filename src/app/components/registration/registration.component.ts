import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/User';
import { Profile } from '../../models/Profile';
import { UsersService } from '../../services/users.service';
import { VehiculesService } from '../../services/vehicules.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  isLivreur: boolean = false;
  userForm!: FormGroup;
  Profile = Profile;
  selectedAddress: string | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private vehiculeService: VehiculesService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
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
      cin: [''],
      pricePerKm: ['', [Validators.min(0.5), Validators.max(1)]],
      type: [''],
      marque: ['']
    });

    const storedFormData = localStorage.getItem('registrationFormData');
    if (storedFormData) {
      this.userForm.patchValue(JSON.parse(storedFormData));
    }

    this.route.queryParams.subscribe(params => {
      this.selectedAddress = params['selectedAddress'];
      if (this.selectedAddress) {
        this.userForm.get('adresse')?.setValue(this.selectedAddress);
      }
    });

    this.userForm.get('typeUser')?.valueChanges.subscribe(value => {
      this.isLivreur = value === Profile.Livreur;
      this.updateValidators();
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }

    const formData = { ...this.userForm.value };

    if (formData.typeUser === Profile.Expediteur) {
      delete formData.marque;
      delete formData.pricePerKm;
      delete formData.typeVehicule;
      delete formData.cin;
    }

    const userData: User = formData;
    this.userService.addUser(userData).subscribe(response => {
      alert("Utilisateur ajouté avec succès, essayez de vous connecter.");
      localStorage.removeItem('registrationFormData');
      this.router.navigateByUrl('/home');


      if (this.isLivreur) {
      } else {
        this.router.navigateByUrl('/home');
      }
    }, error => {
      console.error(error);
    });
  }

  updateValidators(): void {
    if (this.isLivreur) {
      this.userForm.get('typeVehicule')?.setValidators(Validators.required);
      this.userForm.get('marque')?.setValidators(Validators.required);
      this.userForm.get('pricePerKm')?.setValidators(Validators.required);
      this.userForm.get('cin')?.setValidators(Validators.required);
    } else {
      this.userForm.get('typeVehicule')?.clearValidators();
      this.userForm.get('marque')?.clearValidators();
      this.userForm.get('pricePerKm')?.clearValidators();
      this.userForm.get('cin')?.clearValidators();
    }
    this.userForm.get('typeVehicule')?.updateValueAndValidity();
    this.userForm.get('marque')?.updateValueAndValidity();
    this.userForm.get('pricePerKm')?.updateValueAndValidity();
    this.userForm.get('cin')?.updateValueAndValidity();
  }

  navigateToHome() {
    this.router.navigateByUrl('/home');
  }

  openMap() {
    localStorage.setItem('registrationFormData', JSON.stringify(this.userForm.value));
    this.router.navigate(['/map'], { queryParams: { previousUrl: '/registration' } });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  addVehicule(userId: number): void {
    const vehicule = {
      type: this.userForm.value.typeVehicule,
      marque: this.userForm.value.marque
    };

    this.vehiculeService.addVehicule(vehicule).subscribe(
      response => {
        console.log('Vehicule added:', response);
        this.assignVehicule(response.vehiculeId, this.userForm.value.username);
      },
      error => {
        console.error('Error adding vehicle:', error);
      }
    );
  }

  assignVehicule(vehiculeId: number, username: string): void {
    this.vehiculeService.assignVehicule(vehiculeId, username).subscribe(
      response => {
        console.log('Vehicule assigned:', response);
        this.router.navigateByUrl('/home');
      },
      error => {
        console.error('Error assigning vehicle:', error);
      }
    );
  }
}
