import { Component, OnInit } from '@angular/core';
import { Livraison } from '../../models/Livraison';
import { LivraisonService } from '../../services/livraisons.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { PropositionLivreur } from '../../models/PropositionLivreur';
import { EtatLivraison } from '../../models/EtatLivraison'; 
import { HttpErrorResponse } from '@angular/common/http'; 




@Component({
  selector: 'app-livraisons',
  templateUrl: './livraisons.component.html',
  styleUrls: ['./livraisons.component.css' ]
  
})
export class LivraisonsComponent implements OnInit {
  livraisons: Livraison[] = [];
  filteredLivraisons: Livraison[] = [];
  searchQuery: string = '';
  searchCriteria: string = 'numero';
  showAddForm: boolean = false; 
  livraison: Livraison = { user: { username: '' }, numero: "0",   statut: EtatLivraison.En_Attente, trajet: 0, datelivraison: new Date(), typecolis: '', poidscolis: '' };
  username: string = '';
  livraisonform!: FormGroup;
  propositions: PropositionLivreur[] = [];
  showLivraisonForm: boolean = true;
  livraisonId: number | undefined; 
  showSuccessMessage: boolean = false;
  selectedLivraison: Livraison | null = null;
  showEditForm: boolean = false;



  constructor(private livraisonService: LivraisonService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    
    this.getAllLivraisons();
    
  }

  getAllLivraisons(): void {
    this.livraisonService.getAllLivraisons().subscribe((livraisons: Livraison[]) => {
      this.livraisons = livraisons;
      this.filteredLivraisons = livraisons;
    });
  }

  filterLivraisons(): void {
    if (!this.searchQuery) {
      this.filteredLivraisons = this.livraisons;
      return;
    }

    if (this.searchCriteria === 'numero') {
      this.livraisonService.getLivraisonByNumero(this.searchQuery).subscribe((livraison: Livraison) => {
        this.filteredLivraisons = livraison ? [livraison] : [];
      });
    } else if (this.searchCriteria === 'statut') {
      this.livraisonService.getLivraisonByStatut(this.searchQuery).subscribe((livraisons: Livraison[]) => {
        this.filteredLivraisons = livraisons;
      });
    }
  }

  deleteLivraison(livrasionId: number | undefined) {
    if (livrasionId) {
      this.livraisonService.deleteLivraison(livrasionId).subscribe(
        () => {
          console.log("Livraison deleted successfully");
          this.getAllLivraisons(); 
        },
        error => {
          console.error("Error deleting Livraison:", error);
        }
      );
    }
  }
  
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    this.livraisonform = this.formBuilder.group({
      username: ['', Validators.required],
      adressedepart: ['',Validators.required],
      adressedestination: ['',Validators.required],
      gouvernorat :['', Validators.required],
      trajet: [null,Validators.required],
      datelivraison: [null,Validators.required],
      typecolis: ['',Validators.required],
      poidscolis: [null,Validators.required]
    });
  
  }

 

 

  onSubmit(): void {
    console.log('Form values:', this.livraisonform.value);

    if (this.livraisonform.invalid) {
      console.error('Form is invalid');
      this.livraisonform.markAllAsTouched();

      return;
    }

    const livraison: Livraison = {
      numero: this.livraisonform.get('numero')?.value,
      gouvernorat: this.livraisonform.get('gouvernorat')?.value,

      adressedepart:  this.livraisonform.get('adressedepart')?.value,
      adressedestination:this.livraisonform.get('adressedestination')?.value,
      trajet: this.livraisonform.get('trajet')?.value,
      datelivraison: this.livraisonform.get('datelivraison')?.value,
      typecolis: this.livraisonform.get('typecolis')?.value,
      poidscolis: this.livraisonform.get('poidscolis')?.value
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

  onChooseProposition(livraisonId: number, propoistionId: number): void {
    this.livraisonService.acceptProposition(livraisonId, propoistionId).subscribe(
      () => {
        console.log('Proposition accepted successfully');
        this.showSuccessMessage = true;
        this.showAddForm = false;


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
  editLivraison(livraison: Livraison): void {
    this.selectedLivraison = livraison;
    console.log('Selected Livraison:', this.selectedLivraison);
    this.showEditForm = true;
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.selectedLivraison = null;
  }
  saveLivraison() {
    if (this.selectedLivraison && this.selectedLivraison.livrasionId) {
        console.log('Updating Livraison:', this.selectedLivraison);
        this.livraisonService.updateLivraison(this.selectedLivraison.livrasionId, this.selectedLivraison)
            .subscribe(
                updatedLivraison => {
                    console.log('Livraison updated successfully:', updatedLivraison);
                    this.showEditForm = false;
                  },
                error => {
                    console.error('Error updating Livraison:', error);
                    if (error instanceof HttpErrorResponse) {
                        if (error.status === 400) {
                            console.error('Bad Request - Check if the request body is correct:', error.error);
                        } else {
                            console.error('Server Error:', error.error);
                        }
                    }
                }
            );
    } else {
        console.error('Selected Livraison or its ID is null or undefined.');
    }
}

}