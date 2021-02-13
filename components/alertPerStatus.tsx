import { useRecoilValue } from 'recoil'
import awsState from '../store/aws'
import React from 'react'
import { statusMapping } from './const'
import BarGraph from "./barGraph";
export const AlertPerStatus = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const aws = useRecoilValue(awsState)
  const labels = Array.from(
    new Set(aws.map((data) => statusMapping[data.status]))
  )
  const data = []
  for (const r of labels) {
    data.push(
      aws
        .map((data) => statusMapping[data.status])
        .reduce((total, x) => {
          return x === r ? total + 1 : total
        }, 0)
    )
  }
  return (
    <div className="container">
      <BarGraph labels={labels} data={data} title="Alert per status" />
    </div>
  )
}

export default AlertPerStatus
