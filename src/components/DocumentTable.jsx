import styled from "styled-components";
import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import rightArrow from "../assets/images/rightArrow.png";
import { UserContext } from "../context/userContext";
import axios from "axios";

const DocumentTable = ({ data }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [timeInfo, setTimeInfo] = useState({
    applicationStart: "",
    applicationEnd: "",
  });
  const { userData } = useContext(UserContext);

  const [attachFile, setAttachFile] = useState(null);
  const [selectedOne, setSelectedOne] = useState([]);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTimeInfo = async () => {
      if (!selectedItem) return;

      try {
        const response = await axios.get(
          `https://itsmeweb.store/api/application/detail?applicationId=${selectedItem.applicationId}`
        );

        const { applicationStart, applicationEnd } = response.data.data;

        setTimeInfo({ applicationStart, applicationEnd });
      } catch (error) {
        console.error("시간 정보 가져오기 실패:", error);
        setTimeInfo({
          applicationStart: "불러오기 실패",
          applicationEnd: "불러오기 실패",
        });
      }
    };

    fetchTimeInfo();
  }, [selectedItem]);

  const showInfo = (item) => {
    if (selectedItem && selectedItem === item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const showContent = (item) => {
    navigate("/applied-content", { state: { item } });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const onSelectFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAttachFile(file.name);
    setSelectedOne([file]);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://itsmeweb.store/api/application/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        }
      );

      if (response.data.result === "SUCCESS") {
        const applicationUrl = response.data.data.applicationUrl;
        console.log("applicationUrl", applicationUrl);
        setUploadUrl(applicationUrl);
      } else {
        console.error("업로드 실패:", response.data.error);
        setUploadUrl(null);
      }
    } catch (error) {
      console.error("파일 업로드 중 오류:", error);
      setUploadUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedItem || !uploadUrl) return;

    try {
      const payload = {
        applicationId: selectedItem.applicationId,
        reportUrl: uploadUrl,
      };

      const response = await axios.post(
        "https://itsmeweb.store/api/report",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );

      if (response.data.result === "SUCCESS") {
        console.log("response.data", response.data);
        setIsModalOpen(true);
      } else {
        alert("신청 실패: " + (response.data.error?.message || "오류 발생"));
      }
    } catch (error) {
      console.error("신청 요청 실패:", error);
      alert("요청 실패. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th style={{ textAlign: "start" }}>구분</Th>
              <Th>신청 강의실</Th>
              <Th>신청 날짜</Th>
              <Th>신청 내용</Th>
              <Th style={{ textAlign: "end", paddingRight: "45px" }}>상태</Th>
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

      {selectedItem && (
        <InfoContainer>
          <Title>강의실 대여 결과보고서 신청</Title>
          <hr style={{ margin: "0px" }} />

          <InfoRow>
            <Label>신청 강의실</Label>
            <span>{selectedItem.classroom}</span>
          </InfoRow>
          <DoubleInfoRow>
            <InfoBlock>
              <Label>사용 날짜</Label>
              <span>{selectedItem.applicationDate}</span>
            </InfoBlock>
            <InfoBlock>
              <Label>사용 시간</Label>
              <span>
                {timeInfo.applicationStart} ~ {timeInfo.applicationEnd}
              </span>
            </InfoBlock>
          </DoubleInfoRow>
          <DoubleInfoRow>
            <InfoBlock>
              <Label>성명</Label>
              <span>{userData.userName}</span>
            </InfoBlock>
            <InfoBlock>
              <Label>전화번호</Label>
              <span>{userData.userNumber}</span>
            </InfoBlock>
          </DoubleInfoRow>
          <InfoRow>
            <Label>첨부파일</Label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {selectedOne.length !== 0 ? (
                <span style={{ marginLeft: "20px" }}>{attachFile}</span>
              ) : (
                <NotDownload>파일을 첨부할 수 있습니다.</NotDownload>
              )}
              <FileUploadButton onClick={handleButtonClick}>
                파일 업로드
              </FileUploadButton>
              <HiddenInput
                type="file"
                ref={fileInputRef}
                onChange={onSelectFile}
                accept=".pdf, .doc, .docx, .png, .jpg"
              />
            </div>
          </InfoRow>
          <ButtonContainer>
            <Button onClick={() => navigate("/home")}>이전 페이지</Button>
            <Button
              style={{ marginLeft: "5px" }}
              primary
              onClick={handleSubmit}
              disabled={!uploadUrl || isUploading}
            >
              {isUploading ? "업로드 중.." : "신청"}
            </Button>
          </ButtonContainer>
          {isModalOpen && (
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: "#f1f1f1",
                textAlign: "center",
              }}
            >
              <p style={{ margin: 0, fontWeight: "bold" }}>
                신청이 성공적으로 완료되었습니다.
              </p>
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 12px",
                  border: "none",
                  backgroundColor: "#263a73",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => setIsModalOpen(false)}
              >
                확인
              </button>
            </div>
          )}
        </InfoContainer>
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
  border: 1px solid #4f4f4f;
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

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-bottom: 30px;
  margin-top: 20px;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  width: 98%;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  margin-top: 70px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 13px;
  border-bottom: 1px solid #ddd;
  gap: 30px;
`;

const DoubleInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px;
  border-bottom: 1px solid #ddd;
  gap: 20px;
`;

const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  gap: 30px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileUploadButton = styled.button`
  background: #4f4f4f;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 19px;
  width: 120px;
`;

const NotDownload = styled.span`
  color: #888;
  font-size: 14px;
  margin-left: 20px;
`;
