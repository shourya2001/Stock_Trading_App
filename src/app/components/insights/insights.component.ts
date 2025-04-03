import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { InsightsService } from '../../services/insights.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, NgbModule],
  templateUrl: './insights.component.html',
  styleUrl: './insights.component.css',
})
export class InsightsComponent implements OnInit {
  constructor(private insightsService: InsightsService) {}
  @Input('ticker') ticker = '';

  // sentiments
  sentiments: any = [];

  // Recommendations
  recommendations: any = [];
  chartConstructor: string = 'chart';
  Highcharts: typeof Highcharts = Highcharts;
  recommendationOptions: Highcharts.Options = {};
  buy: Array<number> = [];
  sell: Array<number> = [];
  hold: Array<number> = [];
  strongBuy: Array<number> = [];
  strongSell: Array<number> = [];
  period: Array<string> = [];

  // EPS
  earnings: any = [];
  chartConstructor2: string = 'chart';
  epsOptions: Highcharts.Options = {};
  epsPeriod: Array<string> = [];
  actual: Array<number> = [];
  estimate: Array<number> = [];
  surprise: Array<number> = [];
  formattedLabel: Array<string> = [];

  ngOnInit(): void {
    this.insightsService.getSentiments(this.ticker).subscribe((data) => {
      this.sentiments = data;
    });

    this.insightsService.getRecommendations(this.ticker).subscribe({
      next: (data) => {
        this.buy.length = 0;
        this.sell.length = 0;
        this.hold.length = 0;
        this.strongBuy.length = 0;
        this.strongSell.length = 0;
        this.period.length = 0;
        this.recommendations = data;
        data.forEach((recommendation: any) => {
          this.strongBuy.push(recommendation.strongBuy);
          this.buy.push(recommendation.buy);
          this.hold.push(recommendation.hold);
          this.sell.push(recommendation.sell);
          this.strongSell.push(recommendation.strongSell);
          this.period.push(recommendation.period);
        });
      },
    });

    this.recommendationOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Recommendation Trends',
      },
      xAxis: {
        categories: this.period,
      },
      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
        },
        stackLabels: {
          enabled: false,
          style: {
            fontWeight: 'bold',
            color: 'gray',
          },
        },
      },
      legend: {
        verticalAlign: 'bottom',
        enabled: false,
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: false,
          },
        },
      },
      series: [
        {
          name: 'Strong Buy',
          type: 'column',
          color: '#00FF00',
          data: this.strongBuy,
          dataLabels: {
            enabled: true,
          },
        },
        {
          name: 'Buy',
          type: 'column',
          color: '#90EE90',
          data: this.buy,
          dataLabels: {
            enabled: true,
          },
        },
        {
          name: 'Hold',
          type: 'column',
          color: '#964B00',
          data: this.hold,
          dataLabels: {
            enabled: true,
          },
        },
        {
          name: 'Sell',
          type: 'column',
          color: '#FF0000',
          data: this.sell,
          dataLabels: {
            enabled: true,
          },
        },
        {
          name: 'Strong Sell',
          type: 'column',
          color: '#8b0000',
          data: this.strongSell,
          dataLabels: {
            enabled: true,
          },
        },
      ],
    };

    this.insightsService.getEarnings(this.ticker).subscribe({
      next: (data) => {
        this.earnings = data;
        this.epsPeriod.length = 0;
        this.actual.length = 0;
        this.estimate.length = 0;
        this.surprise.length = 0;
        data.forEach((earning: any) => {
          this.epsPeriod.push(earning.period);
          this.actual.push(earning.actual);
          this.estimate.push(earning.estimate);
          this.surprise.push(earning.surprise);
          this.formattedLabel.push(
            `${earning.period}<br/>Surprise: ${earning.surprise}`
          );
        });
      },
    });
    this.epsOptions = {
      chart: {
        type: 'spline',
      },
      title: {
        text: 'Historical EPS Surprises',
      },
      yAxis: {
        title: {
          text: 'Quarterly EPS',
        },
      },
      tooltip: {
        shared: true,
      },
      xAxis: {
        categories: this.epsPeriod,
      },
      plotOptions: {},
      legend: {
        verticalAlign: 'bottom',
      },
      series: [
        {
          name: 'Estimate',
          type: 'spline',
          color: '#000000',
          data: this.estimate,
        },
        {
          name: 'Actual',
          type: 'spline',
          color: '#0000FF',
          data: this.actual,
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },
    };
  }
}
