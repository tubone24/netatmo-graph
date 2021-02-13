import React from 'react'
import { render } from '../testUtils'
import Home from '../../pages/index'
import { RecoilRoot } from 'recoil'

describe('Home page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(
      <RecoilRoot>
        <Home />
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
