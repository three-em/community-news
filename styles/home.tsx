import styled from 'styled-components';

const Container = styled.div`
  background: #f6f6ef;
  margin: auto;

  @media (min-width: 1100px) {
    width: 80%;
  }
`;

const NoPosts = styled.div`
  background: #fff;
  padding: 1rem;

  p {
    font-size: 1.1rem;
  }

  a {
    color: blue;
  }

  @media (min-width: 1100px) {
    padding: 0;
  }
`;

export { Container, NoPosts };
