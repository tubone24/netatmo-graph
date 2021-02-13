import React from 'react'
import { render } from '../testUtils'
import Graph1 from '../../pages/graph1'
import { RecoilRoot } from 'recoil'

describe('Graph1', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Graph1 />
      </RecoilRoot>,
      {}
    )
    // https://github.com/mui-org/material-ui/issues/21293#issuecomment-654921524
    expect(
      asFragment()
        .firstElementChild.innerHTML.replace(/id="mui-[0-9]*"/g, '')
        .replace(/aria-labelledby="(mui-[0-9]* *)*"/g, '')
    ).toMatchSnapshot()
  })
})
