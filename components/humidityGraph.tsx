import { useRecoilValue } from 'recoil'
import netatmoData from '../store/netatmoData'
import React from 'react'
import dayjs from 'dayjs'
import { Line } from 'react-chartjs-2'
export const HumidityGraph = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const netatmo = useRecoilValue(netatmoData)
  const labels = netatmo.map((data) =>
    dayjs.unix(Number(data.timeUtc)).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
  )
  const dataSetHomeHumidity = netatmo.map((data) => data.homeHumidity)
  const dataSetOutdoorHumidity = netatmo.map((data) => data.outdoorHumidity)
  const dataSetIndoorHumidity2 = netatmo.map((data) => data.indoorHumidity2)
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Home Humidity',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'square',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#eee',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataSetHomeHumidity,
      },
      {
        label: 'Outdoor Humidity',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgb(64,192,57)',
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'square',
        pointBorderColor: 'rgba(64,192,57)',
        pointBackgroundColor: '#eee',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(64,192,57)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataSetOutdoorHumidity,
      },
      {
        label: 'Indoor Humidity 2',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(176,192,75,0.4)',
        borderColor: 'rgb(192,190,57)',
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'square',
        pointBorderColor: 'rgb(174,192,57)',
        pointBackgroundColor: '#eee',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(192,181,57)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 1,
        pointRadius: 1,
        pointHitRadius: 10,
        data: dataSetIndoorHumidity2,
      },
    ],
  }
  const options = {
    title: {
      display: true,
      text: 'Humidity',
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
            beginAtZero: false,
          },
        },
      ],
    },
  }
  return <Line data={data} options={options} width={400} height={100} />
}

export default HumidityGraph
