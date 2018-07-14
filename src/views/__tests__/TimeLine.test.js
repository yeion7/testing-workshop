import React from 'react'
import TimeLine from '../TimeLine'
import {render, wait, fireEvent} from 'react-testing-library'
import {userData} from '../__fixtures__/user'
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
    
    const { debug, getByText, container } = render(<TimeLine match={match}/>)

    await wait()

    expect(getByText(userData.name)).toBeTruthy()
    expect(getByText(userData.tweets[0].text)).toBeTruthy()
    expect(container.getElementsByClassName("ant-list-item"))
      .toHaveLength(userData.tweets.length)
  });
  test('TimeLine delete tweet', async () => {
    const {tweets: [tweet]} = userData
    APIMock.Users.getUser.mockImplementation(() => {
      return Promise.resolve(userData)
    })
    
    const { debug, getByTestId, getByText } = render(<TimeLine match={match}/>)

    await wait()

    fireEvent.click(getByTestId(`delete-${tweet.id}`))
    
    await wait()
    
    expect(getByText("No data")).toBeTruthy();
    expect(APIMock.Tweets.deleteTweet).toHaveBeenCalled();
    expect(APIMock.Tweets.deleteTweet)
      .toHaveBeenCalledWith(userData.id, tweet.id);


  });
});