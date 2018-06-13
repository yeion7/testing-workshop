import React, { Component } from "react";
import { Card, Icon, Layout, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import ModalNewUser from "./ModalNewUser";
import uuid from "uuid";
import API from "../api";

const { Meta } = Card;
const { Header, Content } = Layout;

const random = (min, max) => Math.floor(Math.random() * max) + min;

export default class Users extends Component {
  state = {
    users: [],
    modalVisible: false
  };

  componentDidMount = async () => {
    const users = await API.Users.getUsers();
    this.setState({ users });
  };

  toggleModal = () => {
    this.setState(state => ({ ...state, modalVisible: !state.modalVisible }));
  };

  createUser = async values => {
    this.toggleModal();

    const id = uuid();
    const newUser = {
      ...values,
      createdAt: new Date().toISOString(),
      avatar: `https://picsum.photos/200/300/?image=${random(300, 1)}`,
      screen_name: values.user
    };

    this.setState(state => ({
      ...state,
      users: [{ ...newUser, id }, ...state.users]
    }));

    try {
      const user = await API.Users.createUser(newUser);

      this.setState(state => ({
        ...state,
        users: [...state.users.map(u => (u.id === id ? user : u))]
      }));
    } catch (error) {
      NotificationManager.error("Ha ocurrido un error al crear el usuario");
      this.setState(state => ({
        ...state,
        users: [...state.users.filter(u => u.id !== id)]
      }));
    }
  };

  deleteUser = async id => {
    const user = this.state.users.find(user => user.id === id);

    this.setState({
      users: this.state.users.filter(user => user.id !== id)
    });

    try {
      await API.Users.deleteUser(id);
    } catch (error) {
      NotificationManager.error("Ha ocurrido un error al borrar el usuario");
      this.setState({
        users: [user, ...this.state.users]
      });
    }
  };

  render() {
    const { users, modalVisible } = this.state;
    return (
      <Layout>
        <Header>
          <Button type="primary" icon="user-add" onClick={this.toggleModal}>
            Añadir usuario
          </Button>
        </Header>
        <Content>
          <Row gutter={16} align="middle" justify="center" type="flex">
            {users.map(user => (
              <Col key={user.id} xs={20} sm={16} md={12} lg={8}>
                <Card
                  style={{ margin: 15 }}
                  cover={
                    <img
                      width="70"
                      height="380"
                      alt="avatar"
                      src={user.avatar}
                    />
                  }
                  actions={[
                    <Link
                      to={Number.isInteger(+user.id) ? `/user/${user.id}` : ""}
                    >
                      <Icon type="eye" />
                    </Link>,
                    <Button
                      disabled={!Number.isInteger(+user.id)}
                      onClick={() => this.deleteUser(user.id)}
                    >
                      <Icon type="delete" />
                    </Button>
                  ]}
                >
                  <Meta
                    title={user.name}
                    description={`@${user.screen_name}`}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Content>
        <ModalNewUser
          onCancel={this.toggleModal}
          onOk={this.createUser}
          visible={modalVisible}
        />
      </Layout>
    );
  }
}
