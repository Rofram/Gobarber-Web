import React, { useCallback, useRef, useState } from 'react';
import * as Yup from 'yup';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { Link } from 'react-router-dom';

import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/Toast';

import Input from '../../components/input';
import Button from '../../components/button';

import LogoImg from '../../assets/Logo.svg';

import * as S from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string().required('E-mail obrigatório').email('Digite um email valido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        // recuperar a senha
        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação da sua senha, cheque sua caixa de entrada',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Ocorreu um erro ao tentar realizar a recuperação de senha, cheque as credencias.',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  return (
    <S.Container>
      <S.Content>
        <S.AnimationContainer>
          <img src={LogoImg} alt="GoBarber Logo" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar Senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Button loading={loading} type="submit">
              Recuperar
            </Button>
          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>
        </S.AnimationContainer>
      </S.Content>
      <S.Background />
    </S.Container>
  );
};

export default ForgotPassword;
