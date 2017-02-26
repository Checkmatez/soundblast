import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

const DivContainer = styled.div`
  height: 50px;
  background-color: #4b4b4b;
  color: #fff;
`;

const Nav = styled.nav`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1170px;
  margin: 0 auto;
`;

const Logo = styled.i`
  padding: 0 10px;
`;

const StyledLink = styled(Link)`
  color: #fff;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 1.2rem;
  text-decoration: none;
  padding: 15px 0;
  flex: 0 1 auto;
`;

const DivRight = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 0 1 auto;
`;

const DivSearch = styled.div`
  border-radius: 3px;
  background-color: #2B2B2B;
  font-size: 1.1rem;
  margin-right: 20px;
`;

const InputSearch = styled.input`
  border: none;
  text-align: left;
  font-family: "Open Sans";
  outline: 0;
  width: 300px;
  padding: 6px 0px;
  color: #e3e3e3;
  font-weight: 300;
  font-size: 1rem;
  background-color: transparent;
`;

const IconSearch = styled.i`
  padding: 5px 10px;
  font-size: 1rem;
`;

const Header = () => (
  <DivContainer>
    <Nav>
      <StyledLink to="/">
        <Logo className="fa fa-soundcloud" aria-hidden="true" />
        <span>SoundBlast</span>
      </StyledLink>
      <DivRight>
        <DivSearch>
          <IconSearch className="fa fa-search" />
          <InputSearch type="text" placeholder="Search..." />
        </DivSearch>
      </DivRight>
    </Nav>
  </DivContainer>
);

export default Header;
