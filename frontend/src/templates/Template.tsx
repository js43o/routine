import React from 'react';
import styled from '@emotion/styled';
import Header from './Header';
import Footer from './Footer';

const TemplateBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  @media (min-width: 768px) {
    width: 768px;
  }
`;

const ContentBlock = styled.main`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.background_main};
  @media (min-width: 430px) {
  }
`;

type TemplateProps = {
  children: React.ReactNode;
};

const Template = ({ children }: TemplateProps) => {
  return (
    <TemplateBlock>
      <Header />
      <ContentBlock>{children}</ContentBlock>
      <Footer />
    </TemplateBlock>
  );
};

export default Template;
