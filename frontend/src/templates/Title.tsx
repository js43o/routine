import React from 'react';
import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';
import { CgInfinity } from 'react-icons/cg';

const TitleBlock = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'PT Sans Narrow', sans-serif;
  font-size: 2.5rem;
  user-select: none;
  gap: 0.25rem;
  margin: 0;
`;

const LogoBlock = styled(CgInfinity)`
  margin-top: 0.5rem;
`;

const Title = () => {
  return (
    <TitleBlock to="/">
      Routine
      <LogoBlock />
    </TitleBlock>
  );
};

export default Title;
