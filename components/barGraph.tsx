import { Bar } from 'react-chartjs-2'
import { chartBorderColor, chartBackGroundColor } from './const'
import React from "react";

type Props = {
  labels: string[];
  data: number[];
  title: string
}

// named export because of storybook proptypes
// https://github.com/strothj/react-docgen-typescript-loader#export-names
export const BarGraph: React.FC<Props> = ({labels, data, title}): JSX.Element => {
  const graphParam = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        backgroundColor: chartBackGroundColor,
        borderColor: chartBorderColor,
        borderWidth: 1,
      },
    ],
  }
  return (
    <div className="container">
      <Bar data={graphParam} />
    </div>
  )
}

export default BarGraph
