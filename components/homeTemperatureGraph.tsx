import { useRecoilValue } from 'recoil'
import netatmoData from '../store/netatmoData'
import React from 'react'
import dayjs from 'dayjs'
import { Line } from 'react-chartjs-2'
export const HomeTemperatureGraph = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const netatmo = useRecoilValue(netatmoData)
  const labels = netatmo.map((data) =>
    dayjs.unix(Number(data.timeUtc)).format('YYYY-MM-DDTHH:mm:ssZ[Z]')
  )
  const dataSetHomeTemperature = netatmo.map((data) => data.homeTemperature)
  const dataSetOutdoorTemperature = netatmo.map(
    (data) => data.outdoorTemperature
  )
  const data = {
    labels: labels,
    dataSets: [
      {
        label: 'My First dataset',
        fill: true,
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
        data: dataSetHomeTemperature,
      },
      {
        label: 'My First dataset',
        fill: true,
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
        data: dataSetOutdoorTemperature,
      },
    ],
  }
  const options = {
    title: {
      display: true,
      text: 'Home Temperature',
      fontSize: 20,
    },
    legend: {
      display: true,
      position: 'right',
    },
    scales: {
      xAxes: [
        {
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
  return <Line data={data} options={options} />
}

export default HomeTemperatureGraph
