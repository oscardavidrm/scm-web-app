import styled from 'styled-components';
import { Col, Collapse, Tag, Typography } from 'antd';

const { Title } = Typography;

const Column = styled(Col)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ColumnTitle = styled(Tag)`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 5px;
  text-transform: uppercase;
  font-weight: 600;
`;

const CollapseContainer = styled(Collapse)`
  min-height: 65vh;
  max-height: 65vh;
  margin: 10px;
  padding: 30px;
  box-shadow: 0 0 2rem 0 rgba(136, 152, 170, 0.15);
  overflow-y: scroll;

  -ms-overflow-style: none;
  scrollbar-width: none;

  :hover {
    box-shadow: 0 0 3rem 0 rgba(136, 152, 170, 0.2);
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const TimesContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${props => props.theme.media.lg`
    flex-direction: row;
    justify-content: space-around;
  `}
`;

const Time = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleTime = styled(Title)`
  ${props => props.theme.media.lg`
    font-size: 1.4rem !important;
  `}
`;

export { Column, ColumnTitle, CollapseContainer, TimesContainer, Time, TitleTime };
