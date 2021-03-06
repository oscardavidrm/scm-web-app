import styled from 'styled-components';
import { Input, List } from 'antd';

const ProductList = styled(List)`
  ul {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;
  }
`;

const TruckList = styled(List)`
  ul {
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 10px;
  }
`;

const FormContainer = styled.div`
  overflow-y: scroll;
  position: relative;
  height: 73vh;
`;

const ProductContainer = styled.div`
  width: 100%;
  height: fit-content;
  text-align: center;
  padding: 20px 10px;
  border-radius: 5px;
  color: #ffffff;
  font-weight: 600;
  background-color: ${props => props.color ?? 'none'};

  -webkit-transition: background-color 100ms linear;
  -ms-transition: background-color 100ms linear;
  transition: background-color 100ms linear;

  :hover {
    box-shadow: 0 0 1rem 0 rgba(136, 152, 170, 0.2);
    cursor: pointer;
  }
`;

const TruckContainer = styled.div`
  width: 100%;
  height: fit-content;
  text-align: center;
  padding: 20px 10px;
  border-radius: 5px;
  color: #ffffff;
  font-weight: 600;
  background-color: ${props => props.color ?? '#D9D9D9'};

  -webkit-transition: background-color 100ms linear;
  -ms-transition: background-color 100ms linear;
  transition: background-color 100ms linear;

  :hover {
    box-shadow: 0 0 1rem 0 rgba(136, 152, 170, 0.2);
    cursor: pointer;
  }
`;

const PlatesInput = styled(Input)`
  text-transform: uppercase;
`;

const HiddenForm = styled.form`
  position: fixed;
  z-index: -100;
  top: 0;
  left: 0;
`;

export {
  FormContainer,
  ProductContainer,
  TruckContainer,
  PlatesInput,
  ProductList,
  TruckList,
  HiddenForm
};
