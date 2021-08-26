import React, { useCallback, useRef } from 'react';
import * as Yup from 'yup';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { useHistory, useLocation } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';

import Input from '../../components/input';
import Button from '../../components/button';

import LogoImg from '../../assets/Logo.svg';

import * as S from './styles';
import api from '../../services/api';

interface ResetPasswordFormData {
  password: string;
  passwordConfirm: string;
}

const ResetPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();
  const history = useHistory();

  function useQuery(): URLSearchParams {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();
  const token = query.get('token');

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().required('Senha obrigatória'),
          passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Senha não confere'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (!token) {
          throw new Error('Token inválido');
        }

        await api.post('password/reset', {
          password: data.password,
          password_confirmation: data.passwordConfirm,
          token,
        });

        history.push('/');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro ao resetar sua senha',
          description: 'Ocorreu um erro ao tentar resetar sua senha, tente novamente',
        });
      }
    },
    [addToast, history, token],
  );

  return (
    <S.Container>
      <S.Content>
        <S.AnimationContainer>
          <img src={LogoImg} alt="GoBarber Logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />

            <Input
              name="passwordConfirm"
              icon={FiLock}
              type="password"
              placeholder="Confirmação da senha"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </S.AnimationContainer>
      </S.Content>
      <S.Background />
    </S.Container>
  );
};

export default ResetPassword;
