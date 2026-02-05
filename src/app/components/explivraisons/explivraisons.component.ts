import { Component, OnInit } from '@angular/core';
import { Livraison } from '../../models/Livraison';
import { LivraisonService } from '../../services/livraisons.service';
import { UsersService } from '../../services/users.service';
import { SecurityService } from 'src/app/services/security.service';
import { PropositionLivreur } from '../../models/PropositionLivreur';

@Component({
  selector: 'app-explivraisons',
  templateUrl: './explivraisons.component.html',
  styleUrls: ['./explivraisons.component.css']
})
export class ExplivraisonsComponent implements OnInit {
  livraisons: Livraison[] = [];
  filteredLivraisons: Livraison[] = [];
  propositions: PropositionLivreur[] = [];
  userId: number | undefined;
  showEditForm: boolean = false;
  showPropositionsList: boolean = false;
  selectedLivraison: Livraison | null = null;
  livraisonId: number | undefined;

  constructor(
    private livraisonService: LivraisonService,
    private usersService: UsersService,
    private securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.getUserIdByUsername();
  }

  getUserIdByUsername(): void {
    const username = this.securityService.profile?.username;
    if (username) {
      this.usersService.getUserByUsername(username).subscribe((user) => {
        this.userId = user.userId;
        this.getLivraisonByUserId();
      });
    }
  }

  getLivraisonByUserId(): void {
    if (this.userId) {
      this.livraisonService.getLivraisonByUserUserId(this.userId).subscribe((livraisons: Livraison[]) => {
        this.livraisons = livraisons;
        this.filteredLivraisons = livraisons;
      });
    }
  }

  calculatePrix(livraison: Livraison): number {
    const trajet = livraison.trajet ?? 0;
    const pricePerKm = livraison.userasLivreur?.pricePerKm ?? 0;
    return trajet * pricePerKm;
  }

  editLivraison(livraison: Livraison): void {
    this.selectedLivraison = { ...livraison };
    this.showEditForm = true;
  }

  cancelLivraisonEdit(): void {
    this.showEditForm = false;
    this.selectedLivraison = null;
  }

  saveLivraison(): void {
    if (this.selectedLivraison && this.selectedLivraison.livrasionId !== undefined) {
      this.livraisonService.updateLivraison(this.selectedLivraison.livrasionId, this.selectedLivraison)
        .subscribe(updatedLivraison => {
          this.showEditForm = false;
          this.selectedLivraison = null;
          this.getLivraisonByUserId(); 
        }, error => {
          console.error('Error updating livraison:', error);
        });
    } else {
      console.error('Livraison ID is undefined.');
    }
  }

  annulerLivraison(livraison: Livraison): void {
    if (livraison.livrasionId !== undefined) {
      this.livraisonService.annulerLivraison(livraison.livrasionId).subscribe(() => {
        this.getLivraisonByUserId(); 
      });
    } else {
      console.error('Livraison ID is undefined.');
    }
  }

  showPropositions(livraison: Livraison): void {
    if (livraison.livrasionId !== undefined) {
      this.selectedLivraison = livraison;
      this.livraisonId = livraison.livrasionId;
      this.livraisonService.getPropositionsByLivraisonId(livraison.livrasionId).subscribe((propositions: PropositionLivreur[]) => {
        this.propositions = propositions;
        this.showPropositionsList = true;
      });
    } else {
      console.error('Livraison ID is undefined.');
    }
  }

  onChooseProposition(livraisonId: number, propositionId: number): void {
    this.livraisonService.acceptProposition(livraisonId, propositionId).subscribe(() => {
      this.showPropositionsList = false;
      this.selectedLivraison = null;
      this.getLivraisonByUserId();
    });
  }
}
