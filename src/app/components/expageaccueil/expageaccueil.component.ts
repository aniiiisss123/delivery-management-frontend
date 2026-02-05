import { Component, OnInit } from '@angular/core';
import { Livraison } from '../../models/Livraison';
import { LivraisonService } from '../../services/livraisons.service';
import { UsersService } from '../../services/users.service';
import { SecurityService } from 'src/app/services/security.service';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router'; // Import Router from Angular core


@Component({
  selector: 'app-expageaccueil',
  templateUrl: './expageaccueil.component.html',
  styleUrls: ['./expageaccueil.component.css']
})
export class ExpageaccueilComponent implements OnInit {
  livraisons: Livraison[] = [];
  userId: number | undefined;
  barChart: Chart<'bar', number[], string> | undefined;

  constructor(
    private router: Router, // Inject Router service here

    private livraisonService: LivraisonService,
    private usersService: UsersService,
    public securityService: SecurityService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.getUserIdByUsername();
  }

  getUserIdByUsername(): void {
    const username = this.securityService.profile?.username;
    if (username) {
      this.usersService.getUserByUsername(username).subscribe((user) => {
        this.userId = user.userId;
        this.getLivraisonsByUserId();
      });
    }
  }

  getLivraisonsByUserId(): void {
    if (this.userId) {
      this.livraisonService.getLivraisonByUserUserId(this.userId).subscribe((livraisons: Livraison[]) => {
        this.livraisons = livraisons;
        this.countLivraisonsByStatus();
      });
    }
  }

  countLivraisonsByStatus(): void {
    if (this.userId) {
      const statusCounts: { [key: string]: number } = {};

      this.livraisons.forEach((livraison: Livraison) => {
        const status = livraison.statut; // Assuming you have a 'statut' property in Livraison model
        if (status) {
          if (statusCounts[status]) {
            statusCounts[status]++;
          } else {
            statusCounts[status] = 1;
          }
        }
      });

      this.renderBarChart(statusCounts);
    }
  }

  renderBarChart(data: { [key: string]: number }): void {
    const canvas = document.getElementById('livraisonBarChart') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      const labels = Object.keys(data);
      const datasetData = Object.values(data);

      const total = datasetData.reduce((acc, currentValue) => acc + currentValue, 0);

      const chartData = {
        labels: labels,
        datasets: [{
          label: 'Livraisons par Statut',
          data: datasetData,
          backgroundColor: [
            'red',
            'orange',

            'yellow',
            'green',
            'green',
            'green',
            'green'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
          ],
          borderWidth: 1
        }]
      };

      if (this.barChart) {
        this.barChart.destroy(); // Destroy previous chart instance if exists
      }

      this.barChart = new Chart<'bar', number[], string>(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            title: {
              display: true,
              text: `Nombre total: ${total}`,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
            legend: {
              display: false
            }
          }
        }
      });
    }
  }
  // Method to navigate to '/expajout' route
  ajoutercols(): void {
    this.router.navigateByUrl('/expajout');
  }
}