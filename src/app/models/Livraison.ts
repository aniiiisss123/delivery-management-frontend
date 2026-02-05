import { EtatLivraison } from "./EtatLivraison";
import { PropositionLivreur } from "./PropositionLivreur";
import { User } from "./User";

export interface Livraison {
    livrasionId?: number;
    numero?: string;
    statut?: EtatLivraison;
    gouvernorat?:string;

    adressedepart?:string;
    adressedestination?:string;
    trajet?: number;
    datelivraison?: Date;
    typecolis?: string;
    poidscolis?: string;
    user?: User;
    userasLivreur?: User;
    propositionlivreur?: PropositionLivreur[];
  }
  