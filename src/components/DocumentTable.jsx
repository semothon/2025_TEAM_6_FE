import styled from 'styled-components';
import { use, useState } from 'react';
import rightArrow from '../assets/images/rightArrow.png';

const DocumentTable = ({ data }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const showInfo = (item) => {
    if (selectedItem && selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th style={{ textAlign: 'start' }}>구분</Th>
              <Th>신청 강의실</Th>
              <Th>신청 날짜</Th>
              <Th>신청 내용</Th>
              <Th style={{ textAlign: 'end', paddingRight: '45px' }}>상태</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <Td style={{ textAlign: 'start' }}>대여</Td>
                <Td>{item.room}</Td>
                <Td>{item.date}</Td>
                <Td>
                  <ButtonContainer>
                    <Button>
                      내용 보기
                      <img
                        src={rightArrow}
                        alt="rightArrow"
                        style={{ width: '15px', marginRight: '-8px' }}
                      />
                    </Button>
                  </ButtonContainer>
                </Td>
                <Td style={{ width: '100px' }}>
                  <ButtonContainer style={{ justifyContent: 'end' }}>
                    {item.message === '승인' ||
                    item.message === '승인 대기' ||
                    item.message === '선택' ? (
                      <ApprovalButton
                        selected={selectedItem === item}
                        onClick={() =>
                          item.message === '선택' ? showInfo(item) : null
                        }
                      >
                        {item.message}
                      </ApprovalButton>
                    ) : (
                      <RefusalButton>{item.message}</RefusalButton>
                    )}
                  </ButtonContainer>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {/* 선택된 항목 정보 출력 */}
      {selectedItem && (
        <InfoBox>
          <p>신청 강의실: {selectedItem.room}</p>
          <p>신청 날짜: {selectedItem.date}</p>
          <p>신청 내용: {selectedItem.message}</p>
        </InfoBox>
      )}
    </>
  );
};

export default DocumentTable;

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 1200px;
  border-collapse: collapse;
  text-align: center;
`;

const Th = styled.th`
  background-color: #fff;
  padding: 12px;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
  text-align: center;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background-color: #4f4f4f;
  color: white;
  padding: 8px 10px;
  border: 1px sold #4f4f4f;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  font-weight: bold;
  font-size: 12px;
`;

const ApprovalButton = styled.button`
  background-color: ${({ selected }) => (selected ? '#263a73' : 'white')};
  color: ${({ selected }) => (selected ? 'white' : '#263a73')};
  padding: 8px 10px;
  border: 1px solid #263a73;
  cursor: pointer;
  border-radius: 7px;
  width: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
`;

const RefusalButton = styled.button`
  background-color: #263a73;
  color: #fff;
  padding: 8px 10px;
  border: 1px solid #263a73;
  cursor: pointer;
  border-radius: 7px;
  width: 90px;
  font-weight: bold;
  font-size: 12px;
`;

const InfoBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  font-size: 14px;
`;
