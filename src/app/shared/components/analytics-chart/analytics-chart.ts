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
  @Input() color = '#7C3AED';

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
              ? ['#7C3AED', '#22C55E', '#F59E0B', '#EF4444', '#A855F7', '#3B82F6']
              : this.color,
            borderColor: isDoughnut ? '#11111A' : this.color,
            borderWidth: isDoughnut ? 3 : 0,
            borderRadius: isDoughnut ? 0 : 6,
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
              color: '#9A9AAC',
              boxWidth: 10,
              padding: 14,
              font: {
                size: 11,
                weight: 'bold',
              },
            },
          },
          tooltip: {
            backgroundColor: '#171723',
            titleColor: '#FFFFFF',
            bodyColor: '#C7C7D1',
            borderColor: '#2A2A3D',
            borderWidth: 1,
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
                  color: '#9A9AAC',
                  font: {
                    size: 11,
                    weight: 'bold',
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#2A2A3D',
                },
                ticks: {
                  color: '#9A9AAC',
                  precision: 0,
                },
              },
            },
      },
    };

    this.chart = new Chart(this.canvas.nativeElement, config);
  }
}
