import React, { Component } from "react";
import { Form, Input } from "antd";

const FormItem = Form.Item;
const { TextArea } = Input;

class TweetForm extends Component {
  render() {
    const { createTweet, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <FormItem>
          {getFieldDecorator("tweet", {
            rules: [{ required: true, message: "Porfavor ingrese un texto" }]
          })(
            <TextArea
              onKeyDown={createTweet}
              rows={4}
              placeholder="What's happening?"
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(TweetForm);
