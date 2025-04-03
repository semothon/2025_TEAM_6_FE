import styled from "styled-components";

const DocumentTable = ({ data }) => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>구분</Th>
            <Th>신청 강의실</Th>
            <Th>신청 날짜</Th>
            <Th>신청 내용</Th>
            <Th>상태</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <Td>대여</Td>
              <Td>{item.room}</Td>
              <Td>{item.date}</Td>
              <Td>
                <ButtonContainer>
                  <Button>내용 보기</Button>
                </ButtonContainer>
              </Td>
              <Td>
                <ButtonContainer>
                  {item.message === "승인" ||
                  item.message === "승인 대기" ||
                  item.message === "선택" ? (
                    <ApprovalButton
                      onClick={() =>
                        item.message === "선택"
                          ? setSelectedMessage(item)
                          : null
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
  background-color: #f4f4f4;
  padding: 12px;
  border-bottom: 2px solid #ddd;
  text-align: center;
  font-size: 14px;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: center;
  font-size: 13px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  background-color: #444;
  color: white;
  padding: 5px 10px;
  border: 2px sold #444;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  font-weight: bold;
  font-size: 12px;
`;

const ApprovalButton = styled.button`
  background-color: white;
  color: #263a73;
  padding: 5px 10px;
  border: 2px solid #263a73;
  cursor: pointer;
  border-radius: 7px;
  width: 80px;
  font-weight: bold;
  font-size: 12px;
`;

const RefusalButton = styled.button`
  background-color: #263a73;
  color: #fff;
  padding: 5px 10px;
  border: 2px solid #263a73;
  cursor: pointer;
  border-radius: 7px;
  width: 80px;
  font-weight: bold;
  font-size: 12px;
`;
