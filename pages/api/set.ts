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
  params.append('grant_type', 'password')
  params.append('client_id', process.env.NETATMO_CLIENT_ID)
  params.append('client_secret', process.env.NETATMO_CLIENT_SECRET)
  params.append('username', process.env.NETATMO_USERNAME)
  params.append('password', process.env.NETATMO_PASSWORD)
  params.append('scope', 'read_station')
  axios
    .post<AuthResp>('https://api.netatmo.com/oauth2/token', params)
    .then((resp) => {
      const accessToken = resp.data.access_token
      axios
        .get<GetStationDataResp>(
          `https://api.netatmo.com/api/getstationsdata?access_token=${accessToken}`
        )
        .then((resp2) => {
          console.log(resp2.data);
          console.log(resp2.data.body);
          console.log(resp2.data.body.devices);
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
          let moduleReachable = true
          let rain
          let sumRain1
          let sumRain24
          let windStrength
          let windAngle
          let gustStrength
          let gustAngle
          let maxWindStr
          let maxWindAngle
          for (const module of modules) {
            console.log(module.module_name);
            if (module.dashboard_data.Temperature) {
              outdoorTemperature = module.dashboard_data.Temperature
            }
            if (module.dashboard_data.Humidity) {
              outdoorHumidity = module.dashboard_data.Humidity
            }
            if (module.dashboard_data.min_temp) {
              outdoorMinTemp = module.dashboard_data.min_temp
            }
            if (module.dashboard_data.max_temp) {
              outdoorMaxTemp = module.dashboard_data.max_temp
            }
            if (!module.reachable) {
              moduleReachable = false
            }
            rain = module.dashboard_data.Rain || 0
            sumRain1 = module.dashboard_data.sum_rain_1 || 0
            sumRain24 = module.dashboard_data.sum_rain_24 || 0
            windStrength = module.dashboard_data.WindStrength || 0
            windAngle = module.dashboard_data.WindAngle || 0
            gustStrength = module.dashboard_data.GustStrength || 0
            gustAngle = module.dashboard_data.GustAngle || 0
            maxWindStr = module.dashboard_data.max_wind_str || 0
            maxWindAngle = module.dashboard_data.max_wind_angle || 0
          }
          const q = faunadb.query
          const faunadbClient = new faunadb.Client({
            secret: process.env.FAUNADB_SERVER_SECRET,
          })
          const moduleData = {
            data: {
              stationName,
              homeName,
              timeUtc,
              homeReachable,
              homeTemperature,
              homeCO2,
              homeHumidity,
              homeNoise,
              homePressure,
              homeAbsolutePressure,
              homeMinTemp,
              homeMaxTemp,
              outdoorTemperature,
              outdoorHumidity,
              outdoorMinTemp,
              outdoorMaxTemp,
              rain,
              sumRain1,
              sumRain24,
              windStrength,
              windAngle,
              gustStrength,
              gustAngle,
              maxWindStr,
              maxWindAngle,
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
