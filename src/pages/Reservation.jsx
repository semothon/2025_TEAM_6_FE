import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import { useRef, useState } from 'react';
import { VscClose } from 'react-icons/vsc';
import Modal from '../components/Modal';
import axios from 'axios';

const Reservation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  // classroomInfo -> Object -> {id, image, number, capacity}
  const { date, startTime, endTime, classroomInfo, collgeName } =
    location.state || {};

  // date 형태 변형. Tue Apr 15 2025 -> 2025-04-15
  const originalDate = date;
  const dateObj = new Date(originalDate);
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  // 화면에 출력되는 파일
  const [selectedOne, setSelectedOne] = useState([]);
  // 서버에 보내지는 파일
  const [selectedFiles, setSelectedFiles] = useState(null);
  // 신청하면 뜨는 모달
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 업로드 응답 객체 전체를 저장할 상태 변수 생성
  const [uploadResponse, setUploadResponse] = useState(null);
  // 파일 업로드 로딩 상태
  const [isUploading, setIsUploading] = useState(false);

  // "파일 업로드" 버튼을 누를 때때
  // 파일 업로드를 하고 applicationParticipant, applicationPurpose, applicationUrl을 받음
  const onSelectFile = async (e) => {
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // UI에 파일 이름 업데이트
    setSelectedOne((prev) => [...prev, file.name]);
    setSelectedFiles(file);

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('file', file); // 백엔드가 기대하는 키 이름("file")과 일치해야 함

    // 업로드 시작 시 로딩 상태 true로 설정
    setIsUploading(true);
    try {
      const response = await axios.post(
        'https://itsmeweb.store/api/application/upload',
        formData,
        {
          headers: {
            // axios가 자동으로 올바른 Content-Type과 boundary를 설정하므로,
            // 명시적으로 설정하지 않아도 무방
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('✅ 업로드 성공:', response.data);
      setUploadResponse(response.data);
    } catch (err) {
      console.error('❌ 업로드 실패:', err);
    } finally {
      // 업로드 완료 후 로딩 상태 false로 설정
      setIsUploading(false);
    }
  };

  // console.log("uploadResponse:", uploadResponse.data);

  // 첨부파일 이름들을 보여줄 UI
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
    fileInputRef.current.click(); // 파일 업로드 버튼 클릭 시 파일 선택 input을 실행
  };

  // "신청" 버튼 클릭 시 호출될 함수: 지정된 형태로 payload를 구성하여 서버에 전송
  const handleSubmit = async () => {
    // startTime과 endTime은 예: 18.5, 22.0 등으로 전달되며, .5인 경우 30분, 정수면 00분으로 변환
    const startHour = Math.floor(startTime);
    const startMinute = startTime % 1 === 0.5 ? 30 : 0;
    const endHour = Math.floor(endTime);
    const endMinute = endTime % 1 === 0.5 ? 30 : 0;

    // 두 자릿수 형식의 문자열로 변환 ("18" -> "18", "8" -> "08")
    const formattedStartTime = `${startHour
      .toString()
      .padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;
    const formattedEndTime = `${endHour.toString().padStart(2, '0')}:${endMinute
      .toString()
      .padStart(2, '0')}:00`;

    // 요청에 보낼 payload 구성 (제공해주신 JSON 형태에 맞춤)
    const payload = {
      userId: '2023105715', // 실제 사용자 아이디로 대체 필요
      classroomId: classroomInfo.id,
      applicationUseDate: formattedDate, // "YYYY-MM-DD"
      applicationStart: formattedStartTime,
      applicationEnd: formattedEndTime,
      // uploadResponse의 필드를 참조하여 payload에 적용
      applicationPurpose: uploadResponse
        ? uploadResponse.data.applicationPurpose
        : '',
      applicationParticipants: uploadResponse
        ? uploadResponse.data.applicationParticipant
        : '', // 참여 인원
      applicationUrl: uploadResponse ? uploadResponse.data.applicationUrl : '', // 업로드된 파일의 URL (없으면 빈 문자열)
    };

    console.log('uploadResponse', uploadResponse.data.applicationParticipant);
    console.log('payload', payload.applicationParticipants);

    try {
      const response = await axios.post(
        'https://itsmeweb.store/api/application',
        payload
      );
      console.log('응답 데이터:', response.data);
      // 응답 형태: { "result": "SUCCESS", "data": {}, "error": { "code": "string", "message": "string" } }
      if (response.data.result === 'SUCCESS') {
        setIsModalOpen(true);
      } else {
        console.error('서버 에러:', response.data.error.message);
      }
    } catch (err) {
      console.error('요청 실패:', err);
    }
  };

  return (
    <>
      <Header role="USER" />
      <PageWrapper>
        <Container>
          {date ? (
            <div>
              <Title>강의실 대여 신청</Title>
              <hr style={{ margin: '0px' }} />
              <InfoContainer>
                <InfoRow>
                  <Label>신청 강의실</Label>
                  {/* classroomInfo는 객체로, {image, number, capacity} 속성 보유 */}
                  <span>{classroomInfo.number}호</span>
                </InfoRow>
                <DoubleInfoRow>
                  <InfoBlock>
                    <Label>신청 날짜</Label>
                    <span style={{ marginLeft: '15px' }}>{formattedDate}</span>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>신청 시간</Label>
                    <span>
                      {Math.floor(startTime)}:
                      {startTime % 1 === 0.5 ? '30' : '00'} 부터{' '}
                      {Math.floor(endTime)}:{endTime % 1 === 0.5 ? '30' : '00'}{' '}
                      까지
                    </span>
                  </InfoBlock>
                </DoubleInfoRow>
                <DoubleInfoRow>
                  <InfoBlock>
                    <Label>성명</Label>
                    <span style={{ marginLeft: '47px' }}>000</span>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>전화번호</Label>
                    <span style={{ marginLeft: '6px' }}>010-0000-0000</span>
                  </InfoBlock>
                </DoubleInfoRow>

                <InfoRow>
                  <Label>첨부파일</Label>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {selectedOne.length !== 0 ? (
                      <span style={{ marginLeft: '20px' }}>{attachFile}</span>
                    ) : (
                      <NotDownload>파일을 첨부할 수 있습니다.</NotDownload>
                    )}{' '}
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
              </InfoContainer>
              <ButtonContainer>
                <Button onClick={() => navigate('/home')}>이전 페이지</Button>
                <Button
                  style={{ marginLeft: '5px' }}
                  $primary
                  onClick={handleSubmit}
                  disabled={!uploadResponse || isUploading}
                >
                  {isUploading ? '업로드 중..' : '신청'}
                </Button>

                {isModalOpen && (
                  <Modal
                    title="신청 완료"
                    message="신청이 성공적으로 완료되었습니다."
                    onClose={() => setIsModalOpen(false)}
                  />
                )}
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
  gap: 3px;
  margin-bottom: 30px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: left;
  padding: 13px;
  border-bottom: 1px solid #ddd;
`;

const DoubleInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 13px;
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 80px;
`;

const Button = styled.button`
  width: 130px;
  height: 50px;
  padding: 10px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${(props) =>
    props.$primary
      ? '#1d2951'
      : '#4F4F4F'};   // 버튼 속성이 primary이면 #1d2951 아니면 #4F4F4F
  color: white;
  #1d2951
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
  margin-left: 20px;
  font-size: 14px;
`;
