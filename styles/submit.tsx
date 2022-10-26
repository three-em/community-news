import styled from 'styled-components';

const Container = styled.main`
  padding: 0 0.5rem;
  background-color: #f6f6ef;

  @media (min-width: 1100px) {
    width: 80%;
    margin: auto;
  }
`;

const FormItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  justify-content: space-between;

  label {
    font-size: 13px;
    font-weight: 600;
    width: fit-content;
    margin-right: 1rem;
  }

  input,
  textarea {
    width: 80%;
    border: 1px solid gray;
    border-radius: 5px;
    padding: 0.2rem;
    font-family: 'Courier New', Courier, monospace;
  }

  textarea {
    width: 600px;
    height: 100px;
  }

  button {
    display: block;
  }

  @media (min-width: 760px) {
    justify-content: flex-start;

    label {
      width: fit-content;
      margin-right: 1rem;
    }

    input,
    textarea {
      width: 300px;
      border-radius: 5px;
    }
  }
`;

const SubmitButton = styled.button`
  margin-left: 3rem;
  margin-top: 0.2rem;
  padding: 0.4rem;
  width: 100px;
  border: 1px solid gray;
  border-radius: 5px;
  font-weight: 600;
  font-family: 'Courier New', Courier, monospace;
`;

export { Container, FormItem, SubmitButton };
