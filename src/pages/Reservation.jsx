import { useLocation } from "react-router-dom";
import styled from "styled-components";
import UserHeader from "../components/Header/UserHeader";
import { useRef, useState } from "react";
import { VscClose } from "react-icons/vsc";

const Reservation = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);
  const { date, startTime, endTime } = location.state || {};

  // 화면에 출력되는 파일
  const [selectedOne, setSelectedOne] = useState([]);
  // 서버에 보내지는 파일
  const [selectedFiles, setSelectedFiles] = useState(null);

  const onSelectFile = (e) => {
    e.preventDefault();

    if (!e.target.files) return;

    const selectedFiles = e.target.files;

    setSelectedFiles(selectedFiles);

    // 브라우저 상에 보여질 파일 이름 리스트 업데이트
    const fileArray = Array.from(selectedFiles).map((file) => file.name);
    setSelectedOne((prev) => [...prev, ...fileArray]);

    // 파일 선택 후, input 값 초기화
    e.target.value = "";
  };

  // 브라우저 상에 보여질 첨부파일 리스트
  const attachFile =
    selectedOne &&
    selectedOne.map((file, index) => (
      <AttFile key={index}>
        <div>{file}</div>
        <button
          onClick={() => setSelectedOne(selectedOne.filter((e) => e !== file))}
        >
          <VscClose size="17" />
        </button>
      </AttFile>
    ));

  const handleButtonClick = () => {
    fileInputRef.current.click(); // 버튼 클릭 시 input[type="file"] 클릭 실행
  };

  return (
    <>
      <UserHeader />
      <PageWrapper>
        <Container>
          {date ? (
            <div>
              <Title>강의실 대여 신청</Title>
              <hr />
              <InfoContainer>
                <InfoRow>
                  <Label>신청 강의실</Label>
                  <span>103호</span>
                </InfoRow>
                <DoubleInfoRow>
                  <InfoBlock>
                    <Label>신청 날짜</Label>
                    <span>{date}</span>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>신청 시간</Label>
                    <span>
                      {Math.floor(startTime)}:
                      {startTime % 1 === 0.5 ? "30" : "00"} 부터{" "}
                      {Math.floor(endTime)}:{endTime % 1 === 0.5 ? "30" : "00"}{" "}
                      까지
                    </span>
                  </InfoBlock>
                </DoubleInfoRow>
                <DoubleInfoRow>
                  <InfoBlock>
                    <Label>성명</Label>
                    <span>000</span>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>전화번호</Label>
                    <span>010-0000-0000</span>
                  </InfoBlock>
                </DoubleInfoRow>

                <InfoRow>
                  <Label>첨부파일</Label>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {selectedOne.length !== 0 ? (
                      <span>{attachFile}</span>
                    ) : (
                      <NotDownload>파일을 첨부할 수 있습니다.</NotDownload>
                    )}{" "}
                    <FileUploadButton onClick={handleButtonClick}>
                      파일 업로드
                    </FileUploadButton>
                    <HiddenInput
                      type="file"
                      ref={fileInputRef}
                      onChange={onSelectFile}
                      accept=".pdf, .doc, .docx"
                    />
                  </div>
                </InfoRow>
              </InfoContainer>
              <ButtonContainer>
                <Button>목록</Button>
                <Button primary>신청</Button>
              </ButtonContainer>
            </div>
          ) : (
            <div>예약 정보가 없습니다.</div>
          )}
        </Container>
      </PageWrapper>
    </>
  );
};

export default Reservation;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 뷰포트 전체 높이를 차지 */
  width: 100vw; /* 뷰포트 전체 너비를 차지 */
`;

const Container = styled.div`
  width: 1000px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: left;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const DoubleInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const InfoBlock = styled.div`
  display: flex;
  justify-content: left;
  width: 50%;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 30px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const FileUploadButton = styled.button`
  background: #444;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${(props) => (props.primary ? "#1d2951" : "#555")};
  color: white;
`;

const AttFile = styled.div`
  font-size: 14px;
  background-color: #fff;
  display: flex;
  button {
    color: gray;
    background-color: white;
    padding: 2px;
    margin-left: 5px;
    outline: none;
    box-shadow: none;
    border: none;

    &:hover {
      box-shadow: none;
    }
  }
`;

const NotDownload = styled.div`
  font-size: 14px;
`;
