import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DetailsService } from '../../services/details.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsService } from '../../services/charts.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [RouterModule, CommonModule, HighchartsChartModule, NgbModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.css',
})
export class SummaryComponent implements OnInit {
  @Input('quote') quote: any = {};
  @Input('stockDetails') stockDetails: any = {};
  @Input('peers') peers: any = [];
  @Input('ticker') ticker: string = '';
  @Input('change') change: number = 0;

  constructor(
    private detailService: DetailsService,
    private chartsService: ChartsService
  ) {}

  hourlyData: any = [];
  chartOptions: Highcharts.Options = {};
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';

  ngOnInit(): void {
    this.chartsService.getHourlyChartsData(this.ticker).subscribe({
      next: (data) => {
        data.forEach((result: any) => {
          if (result.t) this.hourlyData.push([result.t, result.c]);
        });

        this.chartOptions = {
          chart: {
            backgroundColor: '#e4e4e4',
          },
          title: {
            text: this.ticker + ' Hourly Price Variation',
          },
          xAxis: {
            type: 'datetime',
            minTickInterval: 12,
            scrollbar: { enabled: true },
          },
          navigator: { enabled: true },

          plotOptions: {},
          series: [
            {
              name: this.stockDetails.ticker,
              data: this.hourlyData,
              color: this.change > 0 ? 'green' : 'red',
              type: 'line',
              marker: { enabled: false },
            },
          ],
        };
      },
    });
  }
}
