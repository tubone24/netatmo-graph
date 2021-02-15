import React from 'react'
import TemperatureGraph from './temperatureGraph'
import HumidityGraph from './humidityGraph'
export const Graphs = (): JSX.Element => {
  return (
    <div className="container">
        <TemperatureGraph />
        <HumidityGraph />
      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          flex-wrap: wrap;
          display: flex;
          height: 50%;
          flex-direction: column;
          justify-content: space-around;;
          align-items: center;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}

export default Graphs
