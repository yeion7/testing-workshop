import React from "react";
import TimeLine from "../TimeLine";
import API from "../../api";
import { userData } from "./__fixtures__/";
import faker from "faker";
import {
  cleanup,
  render,
  wait,
  fireEvent
} from "react-testing-library";

jest.mock("../../api");

const params = { params: { id: "10" } };

// Becouse localstorage persist likes
beforeEach(() => {
  localStorage.clear();
});

describe("TimeLine work", () => {
  test("should render", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });
    const { getByText } = render(<TimeLine match={params} />);

    await wait();
    expect(getByText(userData.name)).toBeTruthy();
  });
  test("should not render if not pass user data", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve({});
    });
    const { getByText } = render(<TimeLine match={params} />);

    await wait();
    expect(() => {
      getByText(userData.name);
    }).toThrowError();
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
      <TimeLine match={params} />
    );

    await wait();

    const input = getByPlaceholderText(/happening?/);
    input.value = tweet;

    fireEvent.change(input);
    fireEvent.keyDown(input, {
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

  test("should delete a message", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });

    const {
      tweets: [tweet]
    } = userData;

    const { getByText, getByTestId } = render(<TimeLine match={params} />);

    await wait();

    fireEvent.click(getByTestId(`delete-${tweet.id}`));

    expect(getByText("No data")).toBeTruthy();
    expect(API.Tweets.deleteTweet).toHaveBeenCalled();
    expect(API.Tweets.deleteTweet).toHaveBeenCalledWith(userData.id, tweet.id);
  });

  test("should return tweet if delete throw a error", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });

    API.Tweets.deleteTweet.mockImplementationOnce(() => {
      return Promise.reject({});
    });

    const {
      tweets: [tweet]
    } = userData;

    const { getByText, getByTestId } = render(<TimeLine match={params} />);

    await wait();
    fireEvent.click(getByTestId(`delete-${tweet.id}`));
    expect(getByText("No data")).toBeTruthy();
    await wait();
    expect(getByText(tweet.text)).toBeTruthy();
  });

  test("should can like tweet", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });

    const {
      tweets: [tweet]
    } = userData;

    const { getByTestId, debug, getByText } = render(
      <TimeLine match={params} />
    );

    await wait();
    const likeButton = getByTestId(`favorite-${tweet.id}`);
    fireEvent.click(likeButton);

    expect(likeButton).toHaveStyle("color: rgb(207, 70, 71);");
    expect(getByText(String(tweet.favorite_count + 1))).toBeTruthy();

    await wait();
    expect(API.Tweets.updateTweet).toHaveBeenCalled();
  });

  test("should return count if like throw a error", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });

    API.Tweets.updateTweet.mockImplementationOnce(() => {
      return Promise.reject({});
    });

    const {
      tweets: [tweet]
    } = userData;

    const { getByTestId, getByText } = render(<TimeLine match={params} />);

    await wait();
    const likeButton = getByTestId(`favorite-${tweet.id}`);
    fireEvent.click(likeButton);
    await wait();

    expect(likeButton).not.toHaveStyle("color: rgb(207, 70, 71);");
    expect(getByText(String(tweet.favorite_count))).toBeTruthy();
  });

  test("should persist likes on localstorage", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });

    const {
      tweets: [tweet]
    } = userData;

    const { getByTestId, getByText, rerender } = render(
      <TimeLine match={params} />
    );

    await wait();
    const likeButton = getByTestId(`favorite-${tweet.id}`);
    fireEvent.click(likeButton);
    await wait();
    expect(API.Tweets.updateTweet).toHaveBeenCalled();
    rerender();
    await wait();
    expect(likeButton).toHaveStyle("color: rgb(207, 70, 71);");
  });

  test("should dislike a tweet", async () => {
    API.Users.getUser.mockImplementationOnce(() => {
      return Promise.resolve(userData);
    });

    const {
      tweets: [tweet]
    } = userData;

    const { getByTestId, debug, getByText } = render(
      <TimeLine match={params} />
    );

    await wait();
    const likeButton = getByTestId(`favorite-${tweet.id}`);
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(likeButton).not.toHaveStyle("color: rgb(207, 70, 71);");
    expect(getByText(String(tweet.favorite_count))).toBeTruthy();
  });
});
