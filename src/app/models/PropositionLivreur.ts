import { Livraison } from "./Livraison";
import { User } from "./User";

export interface PropositionLivreur {
    propoistionId?: number;
    prix: number;
    livraison?: Livraison;
    user?: User;
}
