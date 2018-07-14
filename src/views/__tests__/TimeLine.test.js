import React from 'react'
import TimeLine from '../TimeLine'
import {render, wait} from 'react-testing-library'
import {userData} from './__fixtures__/user'
import APIMock from '../../api'

jest.mock('../../api')

const match = {
  params: {
    id: 1
  }
}

describe('TimeLine', () => {
  test('TimeLine Works', async () => {
    APIMock.Users.getUser.mockImplementation(() => {
      return Promise.resolve(userData)
    })
    
    const { debug } = render(<TimeLine match={match}/>)

    await wait()
    debug()
  });
});