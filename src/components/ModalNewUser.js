import React, { Component } from "react";
import { Modal, Form, Input } from "antd";
const FormItem = Form.Item;

class ModalNewUser extends Component {
  handleCreate = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.props.form.resetFields();
      this.props.onOk(values);
    });
  };

  render() {
    const { visible, onCancel, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Modal
        title="Nuevo usuario"
        okText="Crear"
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleCreate}
      >
        <Form layout="vertical">
          <FormItem label="Nombre">
            {getFieldDecorator("name", {
              rules: [
                {
                  required: true,
                  message: "Ingresa un nombre!"
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Usuario">
            {getFieldDecorator("user", {
              rules: [
                {
                  required: true,
                  message: "Ingresa un usuario!"
                }
              ]
            })(<Input />)}
          </FormItem>
          <FormItem label="Descripción">
            {getFieldDecorator("description")(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ModalNewUser);
