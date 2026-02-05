import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LivraisonService } from '../../services/livraisons.service';
import { Livraison } from '../../models/Livraison';
import { PropositionLivreur } from '../../models/PropositionLivreur';
import { Router, ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-expajout',
  templateUrl: './expajout.component.html',
  styleUrls: ['./expajout.component.css']
})
export class ExpajoutComponent implements OnInit {
  username: string = '';
  livraisonform!: FormGroup;
  propositions: PropositionLivreur[] = [];
  showLivraisonForm: boolean = true;
  livraisonId: number | undefined;
  showSuccessMessage: boolean = false;

  constructor(
    private livraisonService: LivraisonService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public securityService: SecurityService
  ) {}

  depart!: string;
  destination!: string;
  ngOnInit(): void {
    this.livraisonform = this.formBuilder.group({
      username: [this.securityService.profile?.username, Validators.required],
      gouvernorat: ['', Validators.required],

      adressedepart: ['',Validators.required],
      adressedestination: ['',Validators.required],
      trajet: [null,Validators.required],
      datelivraison: [null, Validators.required],
      typecolis: ['', Validators.required],
      poidscolis: [null, Validators.required],
    });

    const adressedepartFromMap = history.state.selectedDepartureAddress;
    const adressedestinationFromMap = history.state.selectedDestinationAddress;
    const trajetFromMap = history.state.distance;

    if (adressedepartFromMap) {
      this.livraisonform.get('adressedepart')?.setValue(adressedepartFromMap);
      this.depart = adressedepartFromMap;
    }

    if (adressedestinationFromMap) {
      this.livraisonform.get('adressedestination')?.setValue(adressedestinationFromMap);
      this.destination = adressedestinationFromMap;

    }

    if (trajetFromMap) {
      const trajetFormatted = Number(trajetFromMap).toFixed(0);
      this.livraisonform.get('trajet')?.setValue(trajetFormatted);
    }
    this.checkGouvernorat();
  }

  checkGouvernorat() {
    console.log(this.depart);
    console.log(this.destination);
    if(this.depart && this.destination) {
    const depart = this.depart.toLowerCase();
    const destination = this.destination.toLowerCase();

     if (depart.includes('ariana') || destination.includes('ariana')) {
      this.livraisonform.get('gouvernorat')?.setValue('Ariana');
    } else if (depart.includes('ben arous') || destination.includes('ben arous')) {
      this.livraisonform.get('gouvernorat')?.setValue('Benarous');
    } else if (depart.includes('mannouba') || destination.includes('mannouba')) {
      this.livraisonform.get('gouvernorat')?.setValue('Mannouba');
    } else {
      this.livraisonform.get('gouvernorat')?.setValue('Tunis');
    }
  }
  }

  onSubmit(): void {
    console.log('Form values:', this.livraisonform.value);

    if (this.livraisonform.invalid) {
      console.error('Form is invalid');
      this.markFormGroupTouched(this.livraisonform);
      return;
    }

    const livraison: Livraison = {
      numero: this.livraisonform.get('numero')?.value,
      adressedepart: this.livraisonform.get('adressedepart')?.value,
      adressedestination: this.livraisonform.get('adressedestination')?.value,
      gouvernorat: this.livraisonform.get('gouvernorat')?.value,

      trajet: this.livraisonform.get('trajet')?.value,
      datelivraison: this.livraisonform.get('datelivraison')?.value,
      typecolis: this.livraisonform.get('typecolis')?.value,
      poidscolis: this.livraisonform.get('poidscolis')?.value,
      user: { username: this.livraisonform.get('username')?.value }
    };

    this.username = this.livraisonform.get('username')?.value;
    this.livraisonService.addLivraison(livraison, this.username).subscribe(
      (livraisonId) => {
        console.log('Livraison added successfully. Livraison ID:', livraisonId);
        this.showLivraisonForm = !this.showLivraisonForm;
        this.livraisonId = livraisonId;

        if (this.livraisonId !== undefined) {
          this.fetchPropositionsByLivraisonId(this.livraisonId);
        } else {
          console.error('LivraisonId is undefined');
        }
      },
      (error) => {
        console.error('Error adding livraison:', error);
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        }
      }
    );
  }

  onChooseProposition(livraisonId: number, propositionId: number): void {
    this.livraisonService.acceptProposition(livraisonId, propositionId).subscribe(
      () => {
        console.log('Proposition accepted successfully');
        this.showSuccessMessage = true;
      },
      (error) => {
        console.error('Error accepting proposition:', error);
      }
    );
  }

  fetchPropositionsByLivraisonId(livraisonId: number): void {
    console.log('Fetching propositions by livraisonId:', livraisonId);
    this.livraisonService.getPropositionsByLivraisonId(livraisonId).subscribe((propositions: PropositionLivreur[]) => {
      console.log('Propositions by livraisonId:', propositions);
      this.propositions = propositions;
    }, error => {
      console.error('Error fetching propositions:', error);
    });
  }

  dismissMessage(): void {
    this.showSuccessMessage = false;
  }

  openMap(): void {
    this.router.navigate(['/map2'], {
      queryParams: { previousUrl: '/expajout' }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
