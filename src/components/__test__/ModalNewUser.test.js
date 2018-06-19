import React from "react";
import ModalNewUser from "../ModalNewUser";
import {
  render,
  wait,
  renderIntoDocument,
  Simulate
} from "react-testing-library";

import faker from "faker";

const onCancel = jest.fn();
const onOk = jest.fn();

const data = {
  name: faker.name.firstName(),
  user: faker.internet.userName(),
  description: faker.lorem.paragraph()
};

describe("Create user form", () => {
  test("should submit data filled on form", () => {
    const { getByLabelText, getByText } = renderIntoDocument(
      <ModalNewUser onOk={onOk} visible onCancel={onCancel} />
    );

    const name = getByLabelText("Nombre");
    name.value = data.name;
    Simulate.change(name);
    const user = getByLabelText("Usuario");
    user.value = data.user;
    Simulate.change(user);
    const description = getByLabelText("Descripción");
    description.value = data.description;
    Simulate.change(description);

    const button = getByText("Crear");

    Simulate.click(button);
    expect(onOk).toHaveBeenCalledWith(data);
  });

  test("should display help if not pass validation", () => {
    const { getByLabelText, getByText } = renderIntoDocument(
      <ModalNewUser onOk={onOk} visible onCancel={onCancel} />
    );

    const name = getByLabelText("Nombre");
    const user = getByLabelText("Usuario");
    user.value = data.user;
    Simulate.change(user);
    const description = getByLabelText("Descripción");
    description.value = data.description;
    Simulate.change(description);

    const button = getByText("Crear");

    Simulate.click(button);

    const help = getByText(/Ingresa un nombre/);
    expect(help).toBeTruthy();
    expect(help).toHaveClass("ant-form-explain");
  });
});
