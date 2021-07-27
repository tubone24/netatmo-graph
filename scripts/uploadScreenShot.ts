import {
  encode,
} from 'https://deno.land/std/encoding/base64.ts';

const filePath = './cypress/screenshots/screenshot.spec.js/screenShot.png';
const netatmoUrl = 'https://netatmo-graph.vercel.app/';
const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL') as string;
const imgurClientId = Deno.env.get('IMGUR_CLIENT_ID') as string;

const readImageData = await Deno.readFile(filePath);
const encodedData = encode(readImageData);

const imgurPayload = {
  image: encodedData.replace(new RegExp('data.*base64,'), ''),
  type: 'base64'
}

const imgurHeaders = {
  'Accept': 'application/json',
  'Authorization': `Client-ID ${imgurClientId}`,
  'Content-Type': 'application/json'
}

const imgurRes = await fetch('https://api.imgur.com/3/image', {method: 'POST', headers: imgurHeaders, body: JSON.stringify(imgurPayload)})
const imgurJson = imgurRes.json()
const { data: imgurData } = await imgurJson
const imgurLink = imgurData.link

const netatmoRes = await fetch(`${netatmoUrl}api/get`)
const netatmoJson = netatmoRes.json()
const netatmoData = await netatmoJson
const latestNetatmoData = netatmoData[netatmoData.length - 1]
console.log(latestNetatmoData)

const slackPayload = {
  text: `*How are you?* \n<${netatmoUrl}|Click here> for details! \n${imgurLink}`,
  attachments: [
    {
      fields: [
        {
          title: 'Home Temperature',
          value: `${latestNetatmoData.homeTemperature}℃ (${latestNetatmoData.homeMaxTemp}℃/${latestNetatmoData.homeMinTemp}℃)`,
          short: 'true'
        },
        {
          title: 'Home Humidity',
          value: `${latestNetatmoData.homeHumidity}％`,
          short: 'true'
        },
        {
          title: 'Home CO2',
          value: `${latestNetatmoData.homeCO2}ppm`,
          short: 'true'
        },
        {
          title: 'Home Noise',
          value: `${latestNetatmoData.homeNoise}dB`,
          short: 'true'
        },
        {
          title: 'Home Pressure',
          value: `${latestNetatmoData.homePressure}mb`,
          short: 'true'
        },
        {
          title: 'Outdoor Temperature',
          value: `${latestNetatmoData.outdoorTemperature}℃ (${latestNetatmoData.outdoorMaxTemp}℃/${latestNetatmoData.outdoorMinTemp}℃)`,
          short: 'true'
        },
        {
          title: 'Outdoor Humidity',
          value: `${latestNetatmoData.outdoorHumidity}％`,
          short: 'true'
        },
        {
          title: 'Rainfall',
          value: `${latestNetatmoData.rain}mm (${latestNetatmoData.sumRain1}mm/h / ${latestNetatmoData.sumRain24}mm/24h)`,
          short: 'true'
        },
        {
          title: 'Wind',
          value: `${latestNetatmoData.windStrength}bf (Gust${latestNetatmoData.gustStrength}bf / Max${latestNetatmoData.maxWindStr}bf)`,
          short: 'true'
        },
      ]
    }
  ]
}

const slackHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

await fetch(slackWebhookUrl, {method: 'get', headers: slackHeaders, body: JSON.stringify(slackPayload)})
