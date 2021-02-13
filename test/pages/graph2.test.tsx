import React from 'react'
import { render } from '../testUtils'
import Graph2 from '../../pages/graph2'
import { RecoilRoot } from 'recoil'

describe('Graph2', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Graph2 />
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
