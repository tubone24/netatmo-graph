import { NextApiRequest, NextApiResponse } from 'next'
import faunadb from 'faunadb'
import dayjs from 'dayjs'

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
  if (req.method !== 'DELETE') {
    res.statusCode = 400
    res.json({ error: 'not permitted only DELETE' })
    return
  }
  if (req.headers.key !== process.env.SET_API_KEY) {
    res.statusCode = 403
    res.json({ error: 'invalid API KEY' })
    return
  }
  const oneMonthBeforeEpoch = dayjs().subtract(2, 'day').unix()
  console.log(oneMonthBeforeEpoch);
  const faunadbClient = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
    domain: 'db.us.fauna.com',
  })
  faunadbClient
    .query<DbRefs>(
      q.Paginate(
        q.Range(
          q.Match(q.Index('all_module_data_sort_timeutc')),
          [],
          [undefined, oneMonthBeforeEpoch]
        )
      )
    )
    .then((response) => {
      console.log(response)
      const deleteRef = response.data
      deleteRef.map((ref) => {
        console.log(ref)
        faunadbClient
          .query(q.Delete(ref[0]))
          .then((response2) => {
            console.log(response2)
          })
          .catch((error) => {
            res.statusCode = 500
            res.json({ error: error.toString() })
          })
      })
      res.statusCode = 200
      res.json({ status: 'ok' })
    })
    .catch((error) => {
      res.statusCode = 500
      res.json({ error: error.toString() })
    })
}

export default handler
