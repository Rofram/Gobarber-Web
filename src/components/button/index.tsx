import React, { ButtonHTMLAttributes } from 'react';

import * as S from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <S.Button type="button" {...rest}>
      {children}
    </S.Button>
  );
};

export default Button;
