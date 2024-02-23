// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import faunadb from 'faunadb'

export interface AuthResp {
  access_token: string
  refresh_token: string
  scope: string[]
  expires_in: number
  expire_in: number
}

export interface Module {
  _id: string
  type: string
  module_name: string
  last_setup: number
  data_type: string[]
  battery_percent: number
  reachable: boolean
  firmware: number
  last_message: number
  last_seen: number
  rf_status: number
  battery_vp: number
  dashboard_data: {
    time_utc: number
    Temperature?: number
    Humidity?: number
    min_temp?: number
    max_temp?: number
    date_max_temp?: number
    date_min_temp?: number
    CO2?: number
    temp_trend?: string
    Rain?: number
    sum_rain_1?: number
    sum_rain_24?: number
    WindStrength?: number
    WindAngle?: number
    GustStrength?: number
    GustAngle?: number
    max_wind_str?: number
    max_wind_angle?: number
    date_max_wind_str?: number
  }
}

export interface Device {
  _id: string
  station_name: string
  date_setup: number
  last_setup: number
  type: string
  last_status_store: number
  module_name: string
  firmware: number
  last_upgrade: number
  wifi_status: number
  reachable: boolean
  co2_calibrating: boolean
  data_type: string[]
  place: {
    altitude: number
    city: string
    country: string
    timezone: string
    location: number[]
  }
  home_id: string
  home_name: string
  dashboard_data: {
    time_utc: number
    Temperature: number
    CO2: number
    Humidity: number
    Noise: number
    Pressure: number
    AbsolutePressure: number
    min_temp: number
    max_temp: number
    date_max_temp: number
    date_min_temp: number
    temp_trend: string
    pressure_trend: string
  }
  modules: Module[]
}

export interface GetStationDataResp {
  body: {
    devices: Device[]
  }
  user: {
    mail: string
    administrative: {
      lang: string
      reg_locale: string
      country: string
      unit: number
      windunit: number
      pressureunit: number
      feel_like_algo: number
    }
  }
  status: string
  time_exec: number
  time_server: number
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.statusCode = 400
    res.json({ error: 'not permitted only POST' })
    return
  }
  if (req.headers.key !== process.env.SET_API_KEY) {
    res.statusCode = 403
    res.json({ error: 'invalid API KEY' })
    return
  }
  const params = new URLSearchParams()
  params.append('grant_type', 'refresh_token')
  params.append('client_id', process.env.NETATMO_CLIENT_ID)
  params.append('client_secret', process.env.NETATMO_CLIENT_SECRET)
  params.append('refresh_token', process.env.REFRESH_TOKEN)
  axios
    .post<AuthResp>('https://api.netatmo.com/oauth2/token', params)
    .then((resp) => {
      const accessToken = resp.data.access_token
      axios
        .get<GetStationDataResp>(
          `https://api.netatmo.com/api/getstationsdata?access_token=${accessToken}`
        )
        .then((resp2) => {
          const devices = resp2.data.body.devices
          const stationName = devices[0].station_name
          const homeName = devices[0].home_name
          const timeUtc = devices[0].dashboard_data.time_utc
          const homeReachable = devices[0].reachable
          const homeTemperature = devices[0].dashboard_data.Temperature
          const homeCO2 = devices[0].dashboard_data.CO2
          const homeHumidity = devices[0].dashboard_data.Humidity
          const homeNoise = devices[0].dashboard_data.Noise
          const homePressure = devices[0].dashboard_data.Pressure
          const homeAbsolutePressure =
            devices[0].dashboard_data.AbsolutePressure
          const homeMinTemp = devices[0].dashboard_data.min_temp
          const homeMaxTemp = devices[0].dashboard_data.max_temp
          const modules = devices[0].modules
          let outdoorTemperature
          let outdoorHumidity
          let outdoorMinTemp
          let outdoorMaxTemp
          let indoorTemperature2
          let indoorHumidity2
          let indoorMinTemp2
          let indoorMaxTemp2
          let indoorCo22
          let moduleReachable = true
          let rain = 0
          let sumRain1 = 0
          let sumRain24 = 0
          let windStrength = 0
          let windAngle = 0
          let gustStrength = 0
          let gustAngle = 0
          let maxWindStr = 0
          let maxWindAngle = 0
          for (const module of modules) {
            if (module.module_name === 'Outdoor') {
              if (module.data_type.includes('Temperature')) {
                outdoorTemperature = module.dashboard_data.Temperature
                outdoorMinTemp = module.dashboard_data.min_temp
                outdoorMaxTemp = module.dashboard_data.max_temp
              }
              if (module.data_type.includes('Humidity')) {
                outdoorHumidity = module.dashboard_data.Humidity
              }
            }
            if (module.module_name === '作業部屋') {
              if (module.data_type.includes('Temperature')) {
                indoorTemperature2 = module.dashboard_data.Temperature
                indoorMinTemp2 = module.dashboard_data.min_temp
                indoorMaxTemp2 = module.dashboard_data.max_temp
              }
              if (module.data_type.includes('Humidity')) {
                indoorHumidity2 = module.dashboard_data.Humidity
              }
              if (module.data_type.includes('CO2')) {
                indoorCo22 = module.dashboard_data.CO2
              }
            }
          }
          const q = faunadb.query
          const faunadbClient = new faunadb.Client({
            secret: process.env.FAUNADB_SERVER_SECRET,
            domain: 'db.us.fauna.com',
          })
          const moduleData = {
            data: {
              stationName,
              homeName,
              timeUtc,
              homeReachable,
              homeTemperature: Number(homeTemperature.toFixed(2)),
              homeCO2: Number(homeCO2.toFixed(2)),
              homeHumidity: Number(homeHumidity.toFixed(2)),
              homeNoise: Number(homeNoise.toFixed(2)),
              homePressure: Number(homePressure.toFixed(2)),
              homeAbsolutePressure: Number(homeAbsolutePressure.toFixed(2)),
              homeMinTemp: Number(homeMinTemp.toFixed(2)),
              homeMaxTemp: Number(homeMaxTemp.toFixed(2)),
              outdoorTemperature: Number(outdoorTemperature.toFixed(2)),
              outdoorHumidity: Number(outdoorHumidity.toFixed(2)),
              outdoorMinTemp: Number(outdoorMinTemp.toFixed(2)),
              outdoorMaxTemp: Number(outdoorMaxTemp.toFixed(2)),
              indoorTemperature2: Number(indoorTemperature2.toFixed(2)),
              indoorHumidity2: Number(indoorHumidity2.toFixed(2)),
              indoorMinTemp2: Number(indoorMinTemp2.toFixed(2)),
              indoorMaxTemp2: Number(indoorMaxTemp2.toFixed(2)),
              indoorCo22: Number(indoorCo22.toFixed(2)),
              rain: Number(rain.toFixed(2)),
              sumRain1: Number(sumRain1.toFixed(2)),
              sumRain24: Number(sumRain24.toFixed(2)),
              windStrength: Number(windStrength.toFixed(2)),
              windAngle: Number(windAngle.toFixed(2)),
              gustStrength: Number(gustStrength.toFixed(2)),
              gustAngle: Number(gustAngle.toFixed(2)),
              maxWindStr: Number(maxWindStr.toFixed(2)),
              maxWindAngle: Number(maxWindAngle.toFixed(2)),
            },
          }
          faunadbClient
            .query(q.Create(q.Ref('classes/module_data'), moduleData))
            .then((response) => {
              if (!homeReachable || !moduleReachable) {
                res.statusCode = 404
                res.json({
                  status: 'not reachable',
                  homeReachable,
                  moduleReachable,
                })
              }
              res.statusCode = 200
              res.json(response)
            })
            .catch((error) => {
              res.statusCode = 500
              res.json(error)
            })
        })
        .catch((error) => {
          console.error(error)
          res.statusCode = 500
          res.statusMessage = error.response.statusText || 'InternalServerError'
          res.json({
            error: error.response.statusText || 'InternalServerError',
          })
        })
    })
    .catch((error) => {
      console.error(error.response)
      res.statusCode = error.response.status || 500
      res.statusMessage = error.response.statusText || 'InternalServerError'
      res.json({ error: error.response.statusText || 'InternalServerError' })
    })
}

export default handler
