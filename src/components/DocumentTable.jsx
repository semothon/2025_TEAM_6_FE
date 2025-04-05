import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import rightArrow from "../assets/images/rightArrow.png";

const DocumentTable = ({ data }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  const showInfo = (item) => {
    if (selectedItem && selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const showContent = (item) => {
    // console.log("item", item);
    navigate("/applied-content", { state: { item } });
  };

  return (
    <>
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
                <Td>{item.classroom}</Td>
                <Td>{item.applicationDate}</Td>
                <Td>
                  <ButtonContainer>
                    <Button onClick={() => showContent(item)}>
                      내용 보기
                      <img
                        src={rightArrow}
                        alt="rightArrow"
                        style={{ width: "15px", marginRight: "-8px" }}
                      />
                    </Button>
                  </ButtonContainer>
                </Td>
                <Td>
                  <ButtonContainer>
                    {item.status === "승인" ||
                    item.status === "승인 대기" ||
                    item.status === "선택" ? (
                      <ApprovalButton
                        selected={selectedItem === item}
                        onClick={() =>
                          item.status === "선택" ? showInfo(item) : null
                        }
                      >
                        {item.status}
                      </ApprovalButton>
                    ) : (
                      <RefusalButton>{item.status}</RefusalButton>
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
          <p>신청 강의실: {selectedItem.classroom}</p>
          <p>신청 날짜: {selectedItem.applicationDate}</p>
          <p>신청 내용: {selectedItem.status}</p>
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
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  text-align: center;
  font-size: 13px;
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
  background-color: ${({ selected }) => (selected ? "#263a73" : "white")};
  color: ${({ selected }) => (selected ? "white" : "#263a73")};
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
