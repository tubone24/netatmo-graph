import { useRecoilValue } from 'recoil'
import awsState from '../store/aws'
import React from 'react'
import {
  regionNameMapping,
} from './const'
import BarGraph from './barGraph'

export const AlertPerRegion = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const aws = useRecoilValue(awsState)
  const labels = Array.from(
    new Set(aws.map((data) => regionNameMapping[data.region]))
  )
  const data = []
  for (const r of labels) {
    data.push(
      aws
        .map((data) => regionNameMapping[data.region])
        .reduce((total, x) => {
          return x === r ? total + 1 : total
        }, 0)
    )
  }
  return (
    <div className="container">
      <BarGraph labels={labels} data={data} title="Alert per region" />
    </div>
  )
}

export default AlertPerRegion
