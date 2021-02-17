import { useRecoilValue } from 'recoil'
import netatmoData from '../store/netatmoData'
import React from 'react'
import dayjs from 'dayjs'
import { Line } from 'react-chartjs-2'
export const RainGraph = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const netatmo = useRecoilValue(netatmoData)
  const labels = netatmo.map((data) =>
    dayjs.unix(Number(data.timeUtc)).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
  )
  const dataSetRain = netatmo.map((data) => data.rain)
  const dataSetSumRain1 = netatmo.map((data) => data.sumRain1)
  const dataSetSumRain24 = netatmo.map((data) => data.sumRain24)
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Rain',
        fill: true,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgb(103,161,192)',
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'square',
        pointBorderColor: 'rgb(103,161,192)',
        pointBackgroundColor: '#eee',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(103,161,192)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataSetRain,
      },
      {
        label: 'Sum Rain 1h',
        fill: true,
        lineTension: 0.5,
        backgroundColor: 'rgb(90,107,192)',
        borderColor: 'rgb(90,107,192)',
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'square',
        pointBorderColor: 'rgb(90,107,192)',
        pointBackgroundColor: '#eee',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(90,107,192)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataSetSumRain1,
      },
      {
        label: 'Sum Rain 24h',
        fill: true,
        lineTension: 0.5,
        backgroundColor: 'rgb(0,7,192)',
        borderColor: 'rgb(0,7,192)',
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'square',
        pointBorderColor: 'rgb(0,7,192)',
        pointBackgroundColor: '#eee',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(0,7,192)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataSetSumRain24,
      },
    ],
  }
  const options = {
    title: {
      display: true,
      text: 'Rain',
      fontSize: 20,
    },
    legend: {
      display: true,
      position: 'bottom',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            format: 'YYYY-MM-DDTHH:mm:ssZ[Z]',
            unit: 'hour',
            displayFormats: {
              hour: 'YYYY-MM-DD HH:00:00',
            },
          },
          scaleLabel: {
            display: true,
            labelString: 'Time',
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }
  return <Line data={data} options={options} width={400} height={100} />
}

export default RainGraph
