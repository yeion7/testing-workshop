import React, { Component } from "react";
import { Layout, Avatar, List, Icon } from "antd";
import TweetForm from "../components/TweetForm";

import { NotificationManager } from "react-notifications";

import moment from "moment";

import API from "../api";

const { Sider, Content } = Layout;

const IconText = ({ type, text, liked, onClick, testId }) => (
  <span>
    <Icon
      data-testid={testId}
      role="button"
      onClick={onClick}
      type={type}
      style={{ marginRight: 8, color: `${liked ? "#CF4647" : ""}` }}
    />
    {text}
  </span>
);

export default class TimeLine extends Component {
  state = {
    user: {},
    liked: []
  };

  componentDidMount = async () => {
    const { match } = this.props;
    const user = await API.Users.getUser(match.params.id);
    const likes = JSON.parse(localStorage.getItem("liked"));

    this.setState({
      user,
      liked: likes && likes[user.id] ? likes[user.id] : []
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  createTweet = async (err, values) => {
    if (err) {
      return;
    }

    const form = this.formRef.props.form;
    const { user } = this.state;
    form.resetFields();

    const data = await API.Tweets.createTweet(user.id, {
      created_at: new Date().toISOString(),
      text: values.tweet.trim(),
      retweet_count: 0,
      favorite_count: 0
    });

    this.setState(state => ({
      ...state,
      user: { ...state.user, tweets: [data, ...state.user.tweets] }
    }));
  };

  deleteTweet = async id => {
    const { user } = this.state;
    const tweet = user.tweets.find(t => t.id === id);

    this.setState(state => ({
      ...state,
      user: {
        ...state.user,
        tweets: [...state.user.tweets.filter(t => t.id !== id)]
      }
    }));

    try {
      await API.Tweets.deleteTweet(user.id, id);
    } catch (error) {
      this.setState(state => ({
        ...state,
        user: {
          ...state.user,
          tweets: [tweet, ...state.user.tweets]
        }
      }));
    }
  };

  likeTweet = id => async () => {
    const { user, liked } = this.state;
    const tweet = user.tweets.find(t => t.id === id);
    const isLiked = liked.includes(id);

    try {
      await API.Tweets.updateTweet(user.id, id, {
        favorite_count: isLiked
          ? tweet.favorite_count - 1
          : tweet.favorite_count + 1
      });

      this.setState(state => ({
        ...state,
        user: {
          ...state.user,
          tweets: state.user.tweets.map(
            tweet =>
              tweet.id === id
                ? {
                    ...tweet,
                    favorite_count: isLiked
                      ? tweet.favorite_count - 1
                      : tweet.favorite_count + 1
                  }
                : tweet
          )
        },
        liked: isLiked
          ? state.liked.filter(likeId => likeId !== id)
          : [...state.liked, id]
      }));

      const likes = JSON.parse(localStorage.getItem("liked")) || {};

      localStorage.setItem(
        "liked",
        JSON.stringify({
          ...likes,
          [user.id]: likes[user.id]
            ? likes[user.id].includes(id)
              ? likes[user.id].filter(likeId => likeId !== id)
              : [...likes[user.id], id]
            : [id]
        })
      );
    } catch (error) {
      this.setState(state => ({
        ...state,
        user: {
          ...state.user,
          tweets: state.user.tweets.map(t => (t.id === id ? tweet : t))
        },
        liked: state.liked.filter(likeId => likeId !== id)
      }));

      NotificationManager.error("Ha ocurrido un error :(");
    }
  };

  submitTweet = e => {
    const form = this.formRef.props.form;
    if (
      e.keyCode === 13 &&
      e.shiftKey === false &&
      e.target.value.trim().length > 0
    ) {
      form.validateFields(this.createTweet);
    }
  };

  render() {
    const { user, liked } = this.state;
    if (!user) return;
    return (
      <div style={{ padding: 30 }}>
        <Layout>
          <Layout>
            <Sider theme="light">
              <Avatar size="large" icon="user" src={user.avatar} />
              <h2>{user.name}</h2>
              <h3>@{user.screen_name}</h3>
            </Sider>
            <Content>
              <TweetForm
                wrappedComponentRef={this.saveFormRef}
                createTweet={this.submitTweet}
              />
              <List
                style={{ background: "white" }}
                itemLayout="vertical"
                size="large"
                split
                bordered
                dataSource={user.tweets}
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[
                      <IconText
                        testId={`favorite-${item.id}`}
                        onClick={this.likeTweet(item.id)}
                        liked={liked.includes(item.id)}
                        type="heart"
                        text={item.favorite_count}
                      />,
                      <Icon
                        data-testid={`delete-${item.id}`}
                        role="button"
                        type="delete"
                        onClick={() => this.deleteTweet(item.id)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      title={item.text}
                      description={moment(item.created_at).format("DD-MM-YYYY")}
                    />
                  </List.Item>
                )}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}
