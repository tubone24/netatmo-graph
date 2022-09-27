import { atom } from 'recoil'

const netatmoData = atom({
  key: 'netatmoData',
  default: [
    {
      stationName: '',
      homeName: '',
      timeUtc: 1613290802,
      homeReachable: false,
      homeTemperature: 0,
      homeCO2: 0,
      homeHumidity: 0,
      homeNoise: 0,
      homePressure: 0,
      homeAbsolutePressure: 0,
      homeMinTemp: 0,
      homeMaxTemp: 0,
      outdoorTemperature: 0,
      outdoorHumidity: 0,
      outdoorMinTemp: 0,
      outdoorMaxTemp: 0,
      indoorTemperature2: 0,
      indoorHumidity2: 0,
      indoorMinTemp2: 0,
      indoorMaxTemp2: 0,
      indoorCo22: 0,
      rain: 0,
      sumRain1: 0,
      sumRain24: 0,
      windStrength: 0,
      windAngle: 0,
      gustStrength: 0,
      gustAngle: 0,
      maxWindStr: 0,
      maxWindAngle: 0,
    },
  ],
  dangerouslyAllowMutability: true,
})

export default netatmoData
