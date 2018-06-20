import React from "react";
import Users from "../Users";
import API from "../../api";
import { userData } from "./__fixtures__/";
import { MemoryRouter, Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import faker from "faker";
import {
  cleanup,
  render,
  wait,
  Simulate,
  fireEvent,
  renderIntoDocument
} from "react-testing-library";

jest.mock("../../api");

const data = {
  name: faker.name.firstName(),
  user: faker.internet.userName(),
  description: faker.lorem.paragraph()
};

describe("Users", () => {
  test("should render all users", async () => {
    API.Users.getUsers.mockImplementationOnce(() => {
      return Promise.resolve([userData]);
    });

    const { container, getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Users />
      </MemoryRouter>
    );
    await wait();

    expect(container.getElementsByClassName("ant-card")).toHaveLength(1);
    expect(getByText(userData.name)).toBeTruthy();
  });

  test("should can delete user", async () => {
    API.Users.getUsers.mockImplementationOnce(() => {
      return Promise.resolve([userData]);
    });

    const { container, getByText, getByTestId } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Users />
      </MemoryRouter>
    );
    await wait();

    Simulate.click(getByTestId(`deleteUser-${userData.id}`));
    expect(() => {
      getByText(userData.name);
    }).toThrowError();
  });

  test("should redirect a user page", async () => {
    API.Users.getUsers.mockImplementationOnce(() => {
      return Promise.resolve([userData]);
    });

    const history = createMemoryHistory();
    const { container, getByTestId } = render(
      <Router history={history}>
        <Users />
      </Router>
    );

    await wait();
    fireEvent.click(getByTestId(`showUser-${userData.id}`));
  });

  test("should create a user", async () => {
    API.Users.getUsers.mockImplementationOnce(() => {
      return Promise.resolve([userData]);
    });

    API.Users.createUser.mockImplementationOnce(() => {
      return Promise.resolve({ id: "10", ...data });
    });

    const { getByText, getByTestId, getByLabelText } = renderIntoDocument(
      <MemoryRouter initialEntries={["/"]}>
        <Users />
      </MemoryRouter>
    );

    await wait();
    Simulate.click(getByText("Añadir usuario"));

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
    await wait();

    expect(API.Users.createUser).toHaveBeenCalled();
    await wait();
    expect(getByText(data.name)).toBeTruthy();
  });
});
