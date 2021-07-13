// denoでここら辺のインポートどうやるんだろう.... (TS2691)
// @ts-ignore
import * as fs from 'https://deno.land/std@v0.36.0/node/fs.ts'
// @ts-ignore
import axiod from "https://deno.land/x/axiod/mod.ts";

const filePath = './cypress/screenshots/screenshot.spec.js/screenShot.png';
const netatmoUrl = 'https://netatmo-graph.vercel.app/';
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const imgurClientId = process.env.IMGUR_CLIENT_ID;

const base64Data = fs.readFileSync(filePath, { encoding: 'base64' });

const data = {
  image: base64Data.replace(new RegExp('data.*base64,'), ''),
  type: 'base64'
}

const config = {
  headers: {
    Authorization: `Client-ID ${imgurClientId}`
  }
}

axiod.post('https://api.imgur.com/3/image', data, config).then((resp) => {
  const imageLink = resp.data.data.link
    console.log(imageLink)
    axiod.get(`${netatmoUrl}api/get`).then( (resp) => {
      const latestData = resp.data[resp.data.length - 1]
      console.log(latestData)
      const slackPayload = {
        text: `*How are you?* \n<${netatmoUrl}|Click here> for details! \n${imageLink}`,
        attachments: [
          {
            fields: [
              {
                title: 'Home Temperature',
                value: `${latestData.homeTemperature}℃ (${latestData.homeMaxTemp}℃/${latestData.homeMinTemp}℃)`,
                short: 'true'
              },
              {
                title: 'Home Humidity',
                value: `${latestData.homeHumidity}％`,
                short: 'true'
              },
              {
                title: 'Home CO2',
                value: `${latestData.homeCO2}ppm`,
                short: 'true'
              },
              {
                title: 'Home Noise',
                value: `${latestData.homeNoise}dB`,
                short: 'true'
              },
              {
                title: 'Home Pressure',
                value: `${latestData.homePressure}mb`,
                short: 'true'
              },
              {
                title: 'Outdoor Temperature',
                value: `${latestData.outdoorTemperature}℃ (${latestData.outdoorMaxTemp}℃/${latestData.outdoorMinTemp}℃)`,
                short: 'true'
              },
              {
                title: 'Outdoor Humidity',
                value: `${latestData.outdoorHumidity}％`,
                short: 'true'
              },
              {
                title: 'Rainfall',
                value: `${latestData.rain}mm (${latestData.sumRain1}mm/h / ${latestData.sumRain24}mm/24h)`,
                short: 'true'
              },
              {
                title: 'Wind',
                value: `${latestData.windStrength}bf (Gust${latestData.gustStrength}bf / Max${latestData.maxWindStr}bf)`,
                short: 'true'
              },
            ]
          }
        ]
      }
      axiod.post(slackWebhookUrl, slackPayload).then((resp) => {
        console.log("OK")
      })
    })
}
)
