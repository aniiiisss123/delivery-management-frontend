import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { LivraisonService } from '../../services/livraisons.service';
import { UsersService } from '../../services/users.service';
import { Profile } from '../../models/Profile';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  barChart: Chart<'bar', number[], string> | undefined;
  pieChart: Chart<'pie', number[], string> | undefined;
  lineChart: Chart<'line', number[], string> | undefined;
  months: string[] = [];
  counts: number[] = [];

  constructor(
    private livraisonService: LivraisonService,
    private userService: UsersService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.livraisonService.countLivraisonsByStatus().subscribe(data => {
      this.renderBarChart(data);
    });

    this.fetchAndRenderPieChart();

    this.fetchAndRenderLineChart();
  }

  renderBarChart(data: any): void {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      const labels = Object.keys(data);
      const datasetData = Object.values(data) as number[];

      const total = datasetData.reduce((acc, currentValue) => acc + currentValue, 0);

      const chartData = {
        labels: labels,
        datasets: [{
          label: `Livraison/Statut `,
          data: datasetData,
          backgroundColor: [
            'green',
            'orange',
            'red',
            'yellow',
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

  fetchAndRenderPieChart(): void {
    const admin$ = this.userService.countUsersByProfile(Profile.ADMIN.toString());
    const livreur$ = this.userService.countUsersByProfile(Profile.Livreur.toString());
    const expediteur$ = this.userService.countUsersByProfile(Profile.Expediteur.toString());

    forkJoin([admin$, livreur$, expediteur$]).subscribe({
      next: ([countAdmin, countLivreur, countExpediteur]: [number, number, number]) => {
        this.renderPieChart(countAdmin, countLivreur, countExpediteur);
      },
      error: (err: any) => {
        console.error('Error fetching user counts:', err);
      }
    });
  }

  renderPieChart(countAdmin: number, countLivreur: number, countExpediteur: number): void {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      const total = countAdmin + countLivreur + countExpediteur;

      const data = {
        labels: ['Admin', 'Livreur', 'Expediteur'],
        datasets: [{
          label: `Nombre total:`,
          data: [countAdmin, countLivreur, countExpediteur],
          backgroundColor: [
            '#0e1a77',
            '#f5c4af',
            '#E645ab'
          ],
          hoverOffset: 4
        }]
      };

      try {
        this.pieChart = new Chart<'pie', number[], string>(ctx, {
          type: 'pie',
          data: data,
          options: {
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
                position: 'bottom'
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating pie chart:', error);
      }
    } else {
      console.error('Failed to get canvas context for pie chart');
    }
  }
  fetchAndRenderLineChart(): void {
    this.livraisonService.getLivraisonsByMonth().subscribe(data => {
     

      this.months = data.map(item => this.getMonthName(item[0])); 
      this.counts = data.map(item => item[1]); 

      if (this.months.length === 0 || this.counts.length === 0) {
        console.log('No data available for any month');
        return;
      }

      const lineChartData = {
        labels: this.months,
        datasets: [{
          label: 'Nombre de Livraisons',
          data: this.counts,
          fill: false,
          borderColor: 'orange',
          tension: 0.1
        }]
      };

      const canvas = document.getElementById('lineChart') as HTMLCanvasElement | null;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        if (this.lineChart) {
          this.lineChart.destroy(); 
        }

        this.lineChart = new Chart<'line', number[], string>(ctx, {
          type: 'line',
          data: lineChartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value: any) {
                    if (Number.isInteger(value)) {
                      return value;
                    }
                    return '';
                  }
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Livraisons par Mois',
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
    });
  }

  private getMonthName(monthNumber: number): string {
    switch (monthNumber) {
      case 1: return 'Janvier';
      case 2: return 'Février';
      case 3: return 'Mars';
      case 4: return 'Avril';
      case 5: return 'Mai';
      case 6: return 'Juin';
      case 7: return 'Juillet';
      case 8: return 'Août';
      case 9: return 'Septembre';
      case 10: return 'Octobre';
      case 11: return 'Novembre';
      case 12: return 'Décembre';
      default: return 'Mois inconnu';
    }
  }
}