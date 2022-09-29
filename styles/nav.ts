import styled from 'styled-components';

const NavWrapper = styled.nav`
  background: #662eff;
  display: flex;
  padding: 0.7rem;
  justify-content: space-between;
`;

const NavItems = styled.div`
  > a {
    color: #000;
    font-size: 1.1rem;
    font-weight: 800;
    text-decoration: none;
  }

  > ul {
    list-style: none;
    display: flex;
    gap: 0.4rem;
    align-items: center;
    margin: 0;
    margin-top: 0.4rem;
    padding: 0;

    li {
      a {
        color: #000;
        font-size: 15px;
        text-decoration: none;
      }
    }
  }
`;

const NavConnect = styled.div`
  p {
    margin: 0;
    font-size: 15px;
    font-weight: 550;
    margin-bottom: 1rem;
  }

  button {
    padding: 0.35rem;
    border-radius: 1px;
  }
`;

export { NavWrapper, NavItems, NavConnect };
