import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { rem } from 'polished';
import React from 'react';
import { colors } from '~/utils/colors';

interface StyledButtonProps {
  size?: 'small' | 'medium' | 'large';
  danger?: boolean;
  twoTone?: boolean;
  outlined?: boolean;
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement>, StyledButtonProps {
  children: React.ReactNode;
}

function Button({ children, ...props }: Props) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

const StyledButton = styled.button<StyledButtonProps>`
  cursor: pointer;
  font-size: ${rem(16)};
  font-weight: bold;
  padding: ${rem(8)} ${rem(12)};
  border-radius: 4px;
  color: ${colors.white};
  background-color: ${colors.primary};

  :hover {
    background-color: ${colors.primaryDark};
  }

  :disabled {
    cursor: not-allowed;
    color: ${colors.gray3};
    background: ${colors.gray0};
  }

  ${(props) =>
    props.size === 'small' &&
    css`
      font-size: ${rem(14)};
    `}

  ${(props) =>
    props.size === 'large' &&
    css`
      font-size: ${rem(18)};
    `}

  ${(props) =>
    props.danger &&
    css`
      color: ${colors.white};
      background-color: ${colors.danger};

      :hover {
        background-color: ${colors.danger};
      }
    `}

  ${(props) =>
    props.twoTone &&
    css`
      color: ${colors.primary};
      background-color: ${colors.white};
      border: 1px solid ${colors.primary};

      :hover {
        background-color: ${colors.white};
      }
    `}

    ${(props) =>
    props.outlined &&
    css`
      color: ${colors.primary};
      background: none;

      :hover {
        background-color: whitesmoke;
      }
    `}
`;

export default Button;
