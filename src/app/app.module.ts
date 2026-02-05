import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { SecurityService } from './services/security.service';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './services/authGuard';
import { UsersComponent } from './components/users/users.component';
import { LivraisonsComponent } from './components/livraisons/livraisons.component';
import { CompteComponent } from './components/compte/compte.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ExpageaccueilComponent } from './components/expageaccueil/expageaccueil.component';
import { ExpajoutComponent } from './components/expajout/expajout.component';
import { ExplivraisonsComponent } from './components/explivraisons/explivraisons.component';
import { LivlivraisonsComponent } from './components/livlivraisons/livlivraisons.component';
import { BaseComponent } from './components/base/base.component';
import { MapComponent } from './components/map/map.component';
import { MatIconModule } from '@angular/material/icon';
import { Map2Component } from './components/map2/map2.component';
import { LivpageaccueilComponent } from './components/livpageaccueil/livpageaccueil.component';




const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent ,canActivate: [AuthGuard], data: { roles: ["ADMIN"] } },
  { path: 'users', component: UsersComponent,canActivate: [AuthGuard], data: { roles: ["ADMIN"] } },
  { path: 'livraisons', component: LivraisonsComponent,canActivate: [AuthGuard], data: { roles: ["ADMIN"] } },
  { path: 'compte', component: CompteComponent ,canActivate: [AuthGuard]},
  { path: 'login', component: LoginFormComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'expageaccuiel', component: ExpageaccueilComponent ,canActivate: [AuthGuard], data: { roles: ["Expediteur"] }},
  { path: 'expajout', component: ExpajoutComponent ,canActivate: [AuthGuard], data: { roles: ["Expediteur"] }},
  { path: 'explivraisons', component: ExplivraisonsComponent ,canActivate: [AuthGuard], data: { roles: ["Expediteur"] }},
  { path: 'livlivraisons', component: LivlivraisonsComponent ,canActivate: [AuthGuard], data: { roles: ["Livreur"] }},
  { path: 'livpageacceuil', component: LivpageaccueilComponent ,canActivate: [AuthGuard], data: { roles: ["Livreur"] }},

  { path: 'map', component: MapComponent },
  { path: 'map2', component: Map2Component },
  
  
  { path: '**', redirectTo: 'home' }
];


export function initializeKeycloak(kcService: KeycloakService, securityService: SecurityService,router: Router) {
  return () => {
    return new Promise<void>((resolve, reject) => {
      kcService.init({
        config: {
          realm: "fdelivery",
          clientId: "front-client",
          url: "http://localhost:8181",
        },
        initOptions: {
          responseMode: 'query',
        }
      }).then(async () => {
        if (await kcService.isLoggedIn()) {
          kcService.loadUserProfile().then(profile => {
            securityService.profile = profile;
            const userRoles = kcService.getUserRoles();
            if(userRoles.includes('ADMIN')) {
              router.navigate(['/dashboard']);  
              } else if (userRoles.includes('Expediteur')) {
              router.navigate(['/expageaccuiel']);  
              } else {
                router.navigate(['/livpageacceuil']);  
              }
            resolve();
          }).catch((error) => {
            reject(error);
          });
        } else {
          resolve();
        }
      }).catch((error) => {
        reject(error);
      });
    });
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    BaseComponent,
    UsersComponent,
    LivraisonsComponent,
    LoginFormComponent,
    RegistrationComponent,
    ExpageaccueilComponent,
    ExpajoutComponent,
    ExplivraisonsComponent,
    LivlivraisonsComponent,
    CompteComponent,
    MapComponent,
    Map2Component,
    LivpageaccueilComponent

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    MatIconModule
  ],
  providers: [
    KeycloakService,
    SecurityService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService, SecurityService, Router],
  }],  bootstrap: [AppComponent]
})
export class AppModule { }
