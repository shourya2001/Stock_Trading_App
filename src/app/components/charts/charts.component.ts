import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import { ChartsService } from '../../services/charts.service';
import * as Highcharts from 'highcharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as Highstock from 'highcharts/highstock';
import HC_more from 'highcharts/highcharts-more';
import HC_exporting from 'highcharts/modules/exporting';
import HC_drag_pane from 'highcharts/modules/drag-panes';
import HC_indicators_all from 'highcharts/indicators/indicators-all';
import HC_vbp from 'highcharts/indicators/volume-by-price';
HC_more(Highstock);
HC_exporting(Highstock);
HC_drag_pane(Highstock);
HC_indicators_all(Highstock);
HC_vbp(Highstock);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule, NgbModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css',
})
export class ChartsComponent implements OnInit {
  @Input('volumeData') volumeData: any = [];
  @Input('ohlcData') ohlcData: any = [];
  constructor(private chartsService: ChartsService) {}

  data: any = [];
  today: string = '';
  highstock: typeof Highstock = Highstock;
  historyChartOptions!: Highstock.Options;

  @Input('ticker') ticker = '';

  ngOnInit(): void {
    // credits: https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
    let yourDate = new Date();
    const offset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - offset * 60 * 1000);
    this.today = yourDate.toISOString().split('T')[0];

    this.historyChartOptions = {
      rangeSelector: {
        allButtonsEnabled: true,
        enabled: true,
        selected: 4,
      },
      title: {
        text: this.ticker + ' Historical',
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      navigator: {
        enabled: true,
      },
      scrollbar: {
        enabled: true,
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime',
        ordinal: true,
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          opposite: true,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          opposite: true,
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      plotOptions: {
        series: {
          dataGrouping: {
            units: [
              ['week', [1]],
              ['month', [1, 2, 3, 4, 6]],
            ],
          },
        },
      },
      series: [
        {
          showInLegend: false,
          type: 'candlestick',
          name: this.ticker,
          id: this.ticker,
          zIndex: 2,
          data: this.ohlcData,
        },
        {
          showInLegend: false,
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.volumeData,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: this.ticker,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: this.ticker,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
    };

    // this.chartsService.getChartsData(this.ticker).subscribe({
    //   next: (data) => {
    //     this.data = data;
    //     this.volumeData.length = 0;
    //     data.forEach((result: any) => {
    //       this.volumeData.push([result.t, result.v]);
    //       // this.priceData.push([result.t, result.c]);
    //       this.ohlcData.push([
    //         result.t,
    //         result.o,
    //         result.h,
    //         result.l,
    //         result.c,
    //       ]);
    //     });

    //     // this.chartOptions = {
    //     //   rangeSelector: {
    //     //     allButtonsEnabled: true,
    //     //     enabled: true,
    //     //     selected: 4,
    //     //   },

    //     //   plotOptions: {
    //     //     series: {
    //     //       dataGrouping: {
    //     //         units: [
    //     //           ['week', [1]],
    //     //           ['month', [1, 2, 3, 4, 6]],
    //     //         ],
    //     //       },
    //     //     },
    //     //   },
    //     //   navigator: {
    //     //     enabled: true,
    //     //   },
    //     //   scrollbar: {
    //     //     enabled: true,
    //     //   },
    //     //   credits: {
    //     //     enabled: false,
    //     //   },

    //     //   title: {
    //     //     text: this.ticker + ' Historical',
    //     //   },
    //     //   subtitle: {
    //     //     text: 'With SMA and Volume by Price technical indicators',
    //     //   },
    //     //   xAxis: {
    //     //     tickmarkPlacement: 'on',
    //     //     startOnTick: true,
    //     //     max: this.priceData[this.priceData.length - 1][0],
    //     //     endOnTick: true,
    //     //     showLastLabel: true,
    //     //     tickInterval: 24 * 3600 * 1000,
    //     //     type: 'datetime',
    //     //     // labels: {
    //     //     //   formatter: function () {
    //     //     //     return Highcharts.dateFormat('%d %b', new Date(this.value));
    //     //     //   },
    //     //     // },
    //     //   },

    //     //   yAxis: [
    //     //     {
    //     //       labels: {
    //     //         align: 'left',
    //     //         x: -30,
    //     //       },
    //     //       title: {
    //     //         text: 'Stock Price',
    //     //         margin: 40,
    //     //       },
    //     //       opposite: false,
    //     //       lineWidth: 0,
    //     //       resize: {
    //     //         enabled: true,
    //     //       },
    //     //     },
    //     //     {
    //     //       labels: {
    //     //         align: 'right',
    //     //         x: 40,
    //     //       },
    //     //       title: {
    //     //         text: 'Volume',
    //     //         margin: 40,
    //     //       },
    //     //       top: '35%',
    //     //       height: '65%',
    //     //       offset: 0,
    //     //       lineWidth: 5,
    //     //       // max: Math.max(...this.volumeData),
    //     //     },
    //     //   ],

    //     //   series: [
    //     //     {
    //     //       type: 'area',
    //     //       name: 'Stock Price',
    //     //       data: this.priceData,
    //     //       threshold: null,
    //     //       tooltip: {
    //     //         valueDecimals: 2,
    //     //       },
    //     //       dataGrouping: {
    //     //         enabled: false,
    //     //       },
    //     //       // fillColor: {
    //     //       //   linearGradient: {
    //     //       //     x1: 0,
    //     //       //     y1: 0,
    //     //       //     x2: 0,
    //     //       //     y2: 1,
    //     //       //   },
    //     //       //   stops: [
    //     //       //     [0, Highcharts.getOptions().colors[0]],
    //     //       //     [
    //     //       //       1,
    //     //       //       Highcharts.color(Highcharts.getOptions().colors[0])
    //     //       //         .setOpacity(0)
    //     //       //         .get('rgba'),
    //     //       //     ],
    //     //       //   ],
    //     //       // },
    //     //     },
    //     //     {
    //     //       type: 'column',
    //     //       name: 'Volume',
    //     //       id: 'volume',
    //     //       data: this.volumeData,
    //     //       yAxis: 1,
    //     //       color: 'black',
    //     //     },
    //     //   ],
    //     // };
    //     console.log(this.volumeData, this.ohlcData);
    //     // if (this.ohlcData.length > 0 && this.volumeData.length > 0) {
    //       console.log('here');

    //       // this.chartOptions = {
    //       //   rangeSelector: {
    //       //     allButtonsEnabled: true,
    //       //     enabled: true,
    //       //     selected: 4,
    //       //   },
    //       //   title: {
    //       //     text: this.ticker + ' Historical',
    //       //   },
    //       //   subtitle: {
    //       //     text: 'With SMA and Volume by Price technical indicators',
    //       //   },
    //       //   navigator: {
    //       //     enabled: true,
    //       //   },
    //       //   scrollbar: {
    //       //     enabled: true,
    //       //   },
    //       //   credits: {
    //       //     enabled: false,
    //       //   },
    //       //   xAxis: {
    //       //     type: 'datetime',
    //       //   },
    //       //   yAxis: [
    //       //     {
    //       //       startOnTick: false,
    //       //       endOnTick: false,
    //       //       opposite: true,
    //       //       labels: {
    //       //         align: 'right',
    //       //         x: -3,
    //       //       },
    //       //       title: {
    //       //         text: 'OHLC',
    //       //       },
    //       //       height: '60%',
    //       //       lineWidth: 2,
    //       //       resize: {
    //       //         enabled: true,
    //       //       },
    //       //     },
    //       //     {
    //       //       labels: {
    //       //         align: 'right',
    //       //         x: -3,
    //       //       },
    //       //       opposite: true,
    //       //       title: {
    //       //         text: 'Volume',
    //       //       },
    //       //       top: '65%',
    //       //       height: '35%',
    //       //       offset: 0,
    //       //       lineWidth: 2,
    //       //     },
    //       //   ],
    //       //   tooltip: {
    //       //     split: true,
    //       //   },
    //       //   plotOptions: {
    //       //     series: {
    //       //       dataGrouping: {
    //       //         units: [
    //       //           ['week', [1]],
    //       //           ['month', [1, 2, 3, 4, 6]],
    //       //         ],
    //       //       },
    //       //     },
    //       //   },
    //       //   series: [
    //       //     {
    //       //       showInLegend: false,
    //       //       type: 'candlestick',
    //       //       name: this.ticker,
    //       //       id: this.ticker,
    //       //       zIndex: 2,
    //       //       data: this.ohlcData,
    //       //     },
    //       //     {
    //       //       showInLegend: false,
    //       //       type: 'column',
    //       //       name: 'Volume',
    //       //       id: 'volume',
    //       //       data: this.volumeData,
    //       //       yAxis: 1,
    //       //     },
    //       //     {
    //       //       type: 'vbp',
    //       //       linkedTo: this.ticker,
    //       //       params: {
    //       //         volumeSeriesID: 'volume',
    //       //       },
    //       //       dataLabels: {
    //       //         enabled: false,
    //       //       },
    //       //       zoneLines: {
    //       //         enabled: false,
    //       //       },
    //       //     },
    //       //     {
    //       //       type: 'sma',
    //       //       linkedTo: this.ticker,
    //       //       zIndex: 1,
    //       //       marker: {
    //       //         enabled: false,
    //       //       },
    //       //     },
    //       //   ],
    //       // };
    //     // }
    //   },
    // });
  }
}
