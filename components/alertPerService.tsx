import { useRecoilValue } from 'recoil'
import awsState from '../store/aws'
import React from 'react'
import BarGraph from "./barGraph";

export const AlertPerService = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const aws = useRecoilValue(awsState)
  const labels = Array.from(new Set(aws.map((data) => data.service)))
  const data = []
  for (const r of labels) {
    data.push(
      aws
        .map((data) => data.service)
        .reduce((total, x) => {
          return x === r ? total + 1 : total
        }, 0)
    )
  }
  return (
    <div className="container">
      <BarGraph labels={labels} data={data} title="Alert per service" />
    </div>
  )
}

export default AlertPerService
