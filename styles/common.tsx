import styled from 'styled-components';

const Button = styled.button`
  border: none;
  color: gray;
  background: none;
  cursor: pointer;
  text-decoration: underline;
`;

const Wrapper = styled.main`
  background: #f6f6ef;
  margin: auto;

  @media (min-width: 1100px) {
    width: 80%;
  }
`;
export { Button, Wrapper };
