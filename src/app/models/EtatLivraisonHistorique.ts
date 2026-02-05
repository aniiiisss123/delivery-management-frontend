


export interface Livraison {
    id?: number;
    numero?: number;
    dateEnattente?: Date;
    dateEncours?: Date;
    dateTermine?: Date;
    dateAnnulee?: Date;
    poidscolis?: string;
    livraison?: Livraison;
  
  }
  