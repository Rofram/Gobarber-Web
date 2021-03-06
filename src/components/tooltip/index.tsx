import React from 'react';

import * as S from './styles';

interface TooltipProps {
  title: string;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, children, className }) => (
  <S.Container className={className}>
    {children}
    <span>{title}</span>
  </S.Container>
);

export default Tooltip;
