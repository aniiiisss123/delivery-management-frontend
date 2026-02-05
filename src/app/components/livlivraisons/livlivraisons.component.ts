import { Component, OnInit } from '@angular/core';
import { LivraisonService } from '../../services/livraisons.service';
import { SecurityService } from 'src/app/services/security.service';
import { UsersService } from '../../services/users.service';
import { EmailService } from '../../services/email.service'; 
import { Livraison } from 'src/app/models/Livraison';
import { EtatLivraison } from 'src/app/models/EtatLivraison';

@Component({
  selector: 'app-livlivraisons',
  templateUrl: './livlivraisons.component.html',
  styleUrls: ['./livlivraisons.component.css']
})
export class LivlivraisonsComponent implements OnInit {
  livraisons: Livraison[] = [];
  livreurId: number | undefined;
  showAccepterButton: boolean = true;
  showAnnulerMessage: boolean = false;
  selectedLivraison: any;
  showRecuButton: boolean = false;
  pricePerKm: number = 0;
  livraisonCollected: boolean = false; 
  EtatLivraison = EtatLivraison;
  constructor(
    private livraisonService: LivraisonService,
    private UsersService: UsersService,
    private securityService: SecurityService,
    private emailService: EmailService 
  ) { }

  ngOnInit(): void {
    this.getUserIdByUsername();
  }

  getUserIdByUsername(): void {
    const username = this.securityService.profile?.username;
    if (username) {
      this.UsersService.getUserByUsername(username).subscribe((user) => {
        this.livreurId = user.userId;
        this.pricePerKm = user.pricePerKm ?? 0;  

        this.chargerLivraisons();
      });
    }
  }

  chargerLivraisons() {
    if (this.livreurId) {
      this.livraisonService.getLivraisonsByLivreurId(this.livreurId).subscribe((data: any) => {
        this.livraisons = data.filter((livraison: any) => !livraison.showAnnulerMessage);
      });
    }
  }

  accepterLivraison(livraison: any) {
    if (this.livreurId) {
      this.livraisonService.accepterLivraison(this.livreurId, livraison.livrasionId).subscribe(() => {
        this.chargerLivraisons();
        this.showAccepterButton = false;
        this.selectedLivraison = livraison;
        this.showRecuButton = true;

        const to_name = livraison.user?.username;
        const from_name = 'Fdelivery';
        const numero_livraison = livraison.numero;

        const delivery_person_name = this.securityService.profile?.username; 
        const reply_to = livraison.user?.email;

        if (to_name && from_name && numero_livraison && delivery_person_name && reply_to) {
          this.emailService.sendAcceptanceEmail(to_name, from_name,numero_livraison, delivery_person_name,reply_to).then(() => {
            console.log('Email envoyé avec succès');
          }).catch((error) => {
            console.error('Erreur lors de l\'envoi de l\'email:', error);
          });
        }
      });
    }
  }

  confirmerLivraison(livraisonId: number | undefined) {
    if(livraisonId) {
    this.livraisonService.confirmerLivraison(livraisonId).subscribe(() => {
      this.chargerLivraisons();
    });
  }
  }


annulerLivraison(livraison: any) {
  this.livraisonService.annulerLivraison(livraison.livrasionId).subscribe(() => {
    livraison.showAnnulerMessage = true;
    this.chargerLivraisons();

    const to_name = livraison.user?.username;
    const from_name = 'Fdelivery'; 
    const numero_livraison = livraison.numero;
    const delivery_person_name = this.securityService.profile?.username; 
    const reply_to = livraison.user?.email;

    if (to_name && from_name && numero_livraison && delivery_person_name && reply_to) {
      this.emailService.sendCancellationEmail(to_name, from_name, numero_livraison, delivery_person_name, reply_to).then(() => {
        console.log('Email d\'annulation envoyé avec succès');
      }).catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'email d\'annulation:', error);
      });
    }
  });
}

  showAdditionalInfo(livraison: any) {
    this.selectedLivraison = livraison;
  }
  retour() {
    this.selectedLivraison = null;
  }
  collecterLivraison(livraison: any) {
    livraison.livraisonCollected = true;
    
    livraison.showRecuButton = true; 
  
    
  }


}  