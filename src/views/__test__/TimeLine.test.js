import React from "react";
import TimeLine from "../TimeLine";
import API from "../../api";
import { userData } from "./__fixtures__/";
import faker from "faker";
import {
  render,
  wait,
  renderIntoDocument,
  Simulate
} from "react-testing-library";

jest.mock("../../api");

describe("TimeLine work", () => {
  test("should render", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });
    const { getByText } = render(<TimeLine match={{ params: { id: "10" } }} />);

    await wait();
    expect(getByText(userData.name)).toBeTruthy();
  });

  test("should add a message", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });

    API.Tweets.createTweet.mockImplementationOnce(() => {
      return Promise.resolve({
        id: "47",
        text: tweet,
        userId: userData.id,
        favorite_count: 0
      });
    });

    const tweet = faker.lorem.paragraph();

    const { getByText, getByPlaceholderText, container } = render(
      <TimeLine match={{ params: { id: "10" } }} />
    );

    await wait();

    const input = getByPlaceholderText(/happening?/);
    input.value = tweet;

    Simulate.change(input);
    Simulate.keyDown(input, {
      key: "Enter",
      keyCode: 13,
      which: 13,
      shiftKey: false
    });

    await wait();

    expect(API.Tweets.createTweet).toHaveBeenCalledWith(userData.id, {
      created_at: expect.any(String),
      text: tweet,
      favorite_count: 0,
      retweet_count: 0
    });

    expect(container.querySelectorAll(".ant-list-item")).toHaveLength(
      userData.tweets.length + 1
    );

    expect(getByText(tweet)).toBeTruthy();
  });
});
