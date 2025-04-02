import styled from "styled-components";
import rightArrow from "../assets/images/rightArrow.png";

const DocumentTable = () => {
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
          <tr>
            <Td>대여</Td>
            <Td>539호</Td>
            <Td>2025.03.21</Td>
            <Td>
              <ButtonContainer>
                <Button>내용 보기 </Button>
              </ButtonContainer>
            </Td>
            <Td>
              <ButtonContainer>
                <ApprovalButton>승인 대기</ApprovalButton>
              </ButtonContainer>
            </Td>
          </tr>
          <tr>
            <Td>대여</Td>
            <Td>220호</Td>
            <Td>2025.03.26</Td>
            <Td>
              <ButtonContainer>
                <Button>내용 보기</Button>
              </ButtonContainer>
            </Td>
            <Td>
              <ButtonContainer>
                <ApprovalButton>승인 대기</ApprovalButton>
              </ButtonContainer>
            </Td>
          </tr>
          <tr>
            <Td>대여</Td>
            <Td>226호</Td>
            <Td>2025.03.28</Td>
            <Td>
              <ButtonContainer>
                <Button>내용 보기</Button>
              </ButtonContainer>
            </Td>
            <Td>
              <ButtonContainer>
                <ApprovalButton>승인 대기</ApprovalButton>
              </ButtonContainer>
            </Td>
          </tr>
          <tr>
            <Td>대여</Td>
            <Td>445호</Td>
            <Td>2025.04.02</Td>
            <Td>
              <ButtonContainer>
                <Button>내용 보기</Button>
              </ButtonContainer>
            </Td>
            <Td>
              <ButtonContainer>
                <ApprovalButton>승인 대기</ApprovalButton>
              </ButtonContainer>
            </Td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>
  );
};

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
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: center;
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
`;

const ApprovalButton = styled.button`
  background-color: white;
  color: #263a73;
  padding: 5px 10px;
  border: 2px solid #263a73;
  cursor: pointer;
  border-radius: 7px;
  width: 100px;
  font-weight: bold;
`;

export default DocumentTable;
