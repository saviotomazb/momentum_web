import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics-chart',
  standalone: true,
  templateUrl: './analytics-chart.html',
})
export class AnalyticsChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('canvas') private canvas?: ElementRef<HTMLCanvasElement>;

  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() type: ChartType = 'bar';
  @Input() color = '#3f82d7';

  private chart?: Chart;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.viewReady &&
      (changes['labels'] || changes['values'] || changes['type'] || changes['color'])
    ) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    if (!this.canvas) {
      return;
    }

    this.chart?.destroy();

    const isDoughnut = this.type === 'doughnut' || this.type === 'pie';
    const config: ChartConfiguration = {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: isDoughnut
              ? ['#2f68b8', '#2f9b62', '#f5c75a', '#f25f4c', '#7c9bc5', '#244b79']
              : this.color,
            borderColor: isDoughnut ? '#ffffff' : this.color,
            borderWidth: isDoughnut ? 3 : 0,
            borderRadius: isDoughnut ? 0 : 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 650,
          easing: 'easeOutQuart',
        },
        plugins: {
          legend: {
            display: isDoughnut,
            position: 'bottom',
            labels: {
              color: '#5d7290',
              boxWidth: 10,
              padding: 14,
              font: {
                size: 11,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            backgroundColor: '#244b79',
            displayColors: false,
            padding: 10,
          },
        },
        scales: isDoughnut
          ? undefined
          : {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#5d7290',
                  font: {
                    size: 11,
                    weight: 'bold',
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#dbe3ef',
                },
                ticks: {
                  color: '#5d7290',
                  precision: 0,
                },
              },
            },
      },
    };

    this.chart = new Chart(this.canvas.nativeElement, config);
  }
}
