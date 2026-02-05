import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private userID = 'ZJ_bSLhhIxrmkywLs'; 
  private serviceID = 'service_8ugvhyg';
  private acceptanceTemplateID = 'template_ub9jtup'; 
  private cancellationTemplateID = 'template_qy88nyy'; 

  constructor() {
    emailjs.init(this.userID);
  }

  sendAcceptanceEmail(to_name: string, from_name: string, numero_livraison: string, delivery_person_name: string, reply_to: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_name,
      from_name,
      numero_livraison,
      delivery_person_name,
      reply_to
    };
    return emailjs.send(this.serviceID, this.acceptanceTemplateID, templateParams);
  }

  sendCancellationEmail(to_name: string, from_name: string, numero_livraison: string, delivery_person_name: string, reply_to: string): Promise<EmailJSResponseStatus> {
    const templateParams = {
      to_name,
      from_name,
      numero_livraison,
      delivery_person_name,
      reply_to
    };
    return emailjs.send(this.serviceID, this.cancellationTemplateID, templateParams);
  }
}
