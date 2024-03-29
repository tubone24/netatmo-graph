import { NextApiRequest, NextApiResponse } from 'next'
import faunadb from 'faunadb'

const q = faunadb.query

export interface DbRefs {
  data: object[]
}

export interface DbRefWithData {
  ref: object
  ts: number
  data: {
    stationName: string
    homeName: string
    timeUtc: number
    homeReachable: boolean
    homeTemperature: number
    homeCO2: number
    homeHumidity: number
    homeNoise: number
    homePressure: number
    homeAbsolutePressure: number
    homeMinTemp: number
    homeMaxTemp: number
    outdoorTemperature: number
    outdoorHumidity: number
    outdoorMinTemp: number
    outdoorMaxTemp: number
    indoorTemperature2: number
    indoorHumidity2: number
    indoorMinTemp2: number
    indoorMaxTemp2: number
    indoorCo22: number
    rain: number
    sumRain1: number
    sumRain24: number
    windStrength: number
    windAngle: number
    gustStrength: number
    gustAngle: number
    maxWindStr: number
    maxWindAngle: number
  }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const faunadbClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
    domain: 'db.us.fauna.com',
  })
  faunadbClient
    .query<DbRefs>(
      q.Paginate(q.Match(q.Ref('indexes/all_module_data')), { size: 100000 })
    )
    .then((response) => {
      console.log(response)
      const allModuleDataRefs = response.data
      const getAllModuleDataQuery = allModuleDataRefs.map((ref) => q.Get(ref))
      console.log(getAllModuleDataQuery)
      faunadbClient
        .query<DbRefWithData[]>(getAllModuleDataQuery)
        .then((resp) => {
          const result = resp.map((d) => d.data)
          console.log(result)
          res.statusCode = 200
          res.json(result)
        })
        .catch((error) => {
          res.statusCode = 500
          res.json({ error: error.toString() })
        })
    })
    .catch((error) => {
      res.statusCode = 500
      res.json({ error: error.toString() })
    })
}

export default handler
