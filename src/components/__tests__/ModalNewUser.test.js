import React from "react"
import ModalNewUser from '../ModalNewUser'
import {render, fireEvent} from 'react-testing-library'

describe('ModalNewUser', () => {
  test('should works', () => {
    // Render 
    const onOk = jest.fn()
    const {debug, getByLabelText, getByText} = 
      render(<ModalNewUser visible onOk={onOk} />)

    // Acciones
    const name = getByLabelText('Nombre')
    name.value = 'yeison'
    fireEvent.change(name)
    // Hacer pruebas
    expect(name.value).toBe('yeison');

    const user = getByLabelText('Usuario')
    user.value = 'Usuario'
    fireEvent.change(user)

    const description = getByLabelText('Descripción')
    description.value = 'Descripción'
    fireEvent.change(description)

    fireEvent.click(getByText('Crear'))
    expect(onOk).toHaveBeenCalled();
  });
});