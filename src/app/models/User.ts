import { Livraison } from "./Livraison";
import { Profile } from "./Profile";
import { PropositionLivreur } from "./PropositionLivreur";
import { Vehicule } from "./Vehicule";

export interface User {
    userId?: number;
    username?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    email?: string;
    phone?: number | null; 
    gouvernorat?: string;

    adresse?: string;
    datebirth?: Date | null; 
    typeUser?: Profile | null; 
    pricePerKm?: number | null; 
    cin?: number | null; 
    type?:string;
    marque?:string;
    livraison?: Livraison[] | null; 
    propositionsLivreur?: PropositionLivreur[] | null; 
}
