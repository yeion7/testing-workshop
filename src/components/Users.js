import React, { Component } from "react";
import { Card, Icon, Layout, Row, Col, Button, Modal, Form } from "antd";
import { Link } from "react-router-dom";
import { NotificationManager } from "react-notifications";

import API from "../api";

const { Meta } = Card;
const { Header, Content } = Layout;

const ModalCreateUSer = ({ visible, onCancel, onOk }) => (
  <Modal
    visible={visible}
    onCancel={onCancel}
    onOk={() => {
      console.log("funciona");
    }}
  >
    Añadir usuario
  </Modal>
);
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
                  cover={<img alt="avatar" src={user.avatar} />}
                  actions={[
                    <Link to={`/user/${user.id}`} state={user}>
                      <Icon type="eye" />
                    </Link>,
                    <Icon
                      type="delete"
                      onClick={() => this.deleteUser(user.id)}
                    />
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
        <ModalCreateUSer onCancel={this.toggleModal} visible={modalVisible} />
      </Layout>
    );
  }
}
