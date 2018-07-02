import React from "react";
import ModalNewUser from "../ModalNewUser";
import {
  render,
  fireEvent
} from "react-testing-library";

import faker from "faker";

const onCancel = jest.fn();
const onOk = jest.fn();

const data = {
  name: faker.name.firstName(),
  user: faker.internet.userName(),
  description: faker.lorem.paragraph()
};

describe('modal', () => {
  test("should submit data filled on form", () => {
    const { getByLabelText, getByText } = render(
      <ModalNewUser onOk={onOk} visible onCancel={onCancel} />
    );

    const name = getByLabelText("Nombre");
    name.value = data.name;
    fireEvent.change(name);
    const user = getByLabelText("Usuario");
    user.value = data.user;
    fireEvent.change(user);
    const description = getByLabelText("Descripción");
    description.value = data.description;
    fireEvent.change(description);

    const button = getByText("Crear");

    fireEvent.click(button);
    expect(onOk).toHaveBeenCalledWith(data);
  });

  test("should display help if not pass validation", () => {
    const { getByLabelText, getByText } = render(
      <ModalNewUser onOk={onOk} visible onCancel={onCancel} />
    );

    const user = getByLabelText("Usuario");
    user.value = data.user;
    fireEvent.change(user);

    const description = getByLabelText("Descripción");

    description.value = data.description;
    fireEvent.change(description);

    const button = getByText("Crear");

    fireEvent.click(button);

    const help = getByText(/Ingresa un nombre/);
    expect(help).toBeTruthy();
    expect(help).toHaveClass("ant-form-explain");
  });
});