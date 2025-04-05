import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import { useRef, useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/userContext';
import { VscClose } from 'react-icons/vsc';
import axios from 'axios';
import Modal from '../components/Modal';
import RejectModal from '../components/RejectModal';

const AppliedContent = () => {
  const location = useLocation();
  const { userData } = useContext(UserContext);

  const item = location.state?.item;
  const applicationId = item.applicationId;
  console.log('item', item);
  console.log('applicationId', applicationId);
  const [applicationDetail, setApplicationDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 현재 사용자 role
  const userRole = userData.userRole;

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetail();
    }
  }, [applicationId]);

  // 신청 상세 정보 요청 함수
  const fetchApplicationDetail = async () => {
    try {
      const response = await axios.get(
        'https://itsmeweb.store/api/application/detail',
        {
          params: { applicationId },
          headers: { accept: 'application/json' },
        }
      );
      console.log('response.data', response.data);
      if (response.data.result === 'SUCCESS') {
        const detail = response.data.data;
        console.log('detail', detail);
        setApplicationDetail(detail);
      } else {
        console.error('에러 발생:', response.data.error);
      }
    } catch (error) {
      console.error('요청 실패:', error);
    }
  };

  console.log('applicationDetail', applicationDetail);

  // 승인 처리 함수
  const handleAdminApproval = async () => {
    console.log('Approval button clicked');
    try {
      const response = await axios.post(
        `https://itsmeweb.store/api/application/approve?applicationId=${applicationId}`,
        {},
        {
          headers: { accept: 'application/json' },
        }
      );
      console.log('Approval response:', response.data);

      if (response.data.result === 'SUCCESS') {
        setIsModalOpen(true); // 승인 후 모달 오픈
        fetchApplicationDetail(); // 데이터 갱신
      } else {
        alert(`처리 중 오류가 발생했습니다: ${response.data.error}`);
      }
    } catch (error) {
      alert(`서버 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <>
      <Header role={userRole} />
      <EntireWrapper>
        {isModalOpen && (
          <Modal
            title="승인 완료"
            message="신청이 승인되었습니다."
            onClose={() => setIsModalOpen(false)}
          />
        )}
        <Leftside>
          {/* 이미지 미리보기 */}
          <PreviewWrapper>
            {applicationDetail && (
              <PreviewImage
                src={applicationDetail.applicationUrl}
                alt="신청서 이미지"
              />
            )}
          </PreviewWrapper>
        </Leftside>
        <Rightside>
          {/* 신청 상세 정보 */}
          {applicationDetail && (
            <>
              <Title>강의실 대여 신청</Title>
              <InfoContainer>
                <InfoRow>
                  <Label>구분</Label>
                  <span style={{ marginLeft: '50px' }}>대여</span>
                </InfoRow>
                <InfoRow>
                  <Label>사용 날짜</Label>
                  <span style={{ marginLeft: '19px' }}>
                    {applicationDetail.applicationUseDate}
                  </span>
                </InfoRow>
                <DoubleInfoRow>
                  <InfoBlock>
                    <Label>신청 강의실</Label>
                    <span style={{ marginLeft: '2px' }}>
                      {applicationDetail.classroom}
                    </span>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>신청 시간</Label>
                    {new Date(
                      `1970-01-01T${applicationDetail.applicationStart}`
                    ).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    부터{' '}
                    {new Date(
                      `1970-01-01T${applicationDetail.applicationEnd}`
                    ).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })}
                    까지
                  </InfoBlock>
                </DoubleInfoRow>
                <DoubleInfoRow>
                  <InfoBlock>
                    <Label>신청자</Label>
                    <span style={{ marginLeft: '33px' }}>
                      {applicationDetail.userName}
                    </span>
                  </InfoBlock>
                  <InfoBlock>
                    <Label>전화번호</Label> {applicationDetail.userNumber}
                  </InfoBlock>
                </DoubleInfoRow>
                <InfoRow>
                  <Label>결과</Label>
                  <span style={{ marginLeft: '45px' }}>
                    {applicationDetail.applicationStatus === 'PENDING'
                      ? '승인 대기'
                      : applicationDetail.applicationStatus === 'APPROVED'
                      ? '승인'
                      : applicationDetail.applicationStatus === 'REJECTED'
                      ? '반려'
                      : ''}
                  </span>
                </InfoRow>
                {userRole === 'ADMIN' && applicationDetail && (
                  <ButtonContainer style={{ marginTop: '80px' }}>
                    <ButtonBackPage>이전페이지</ButtonBackPage>
                    <ButtonBottom $primary onClick={handleAdminApproval}>
                      승인
                    </ButtonBottom>
                    <ButtonBottom
                      style={{
                        marginLeft: '3px',
                        border: '2px solid #1d2951',
                        background: 'white',
                        color: '#1d2951',
                      }}
                    >
                      반려
                    </ButtonBottom>
                  </ButtonContainer>
                )}
                {applicationDetail.applicationRejectReason && (
                  <InfoRow>
                    <Label>반려 사유</Label>{' '}
                    {applicationDetail.applicationRejectReason}
                  </InfoRow>
                )}
              </InfoContainer>
            </>
          )}
        </Rightside>
      </EntireWrapper>
    </>
  );
};

export default AppliedContent;
const EntireWrapper = styled.div`
  // display: flex;
  // height: 90vh;
  // justify-content: center;
  // box-sizing: border-box; /* 패딩을 포함한 전체 너비로 계산됨 */
  // margin: 0 auto; // 가운데 정렬
  // padding: 0 10%;
  display: flex;
  height: 90vh;
`;
const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;
const Leftside = styled.div`
  width: 70vh;
  padding: 12px;
  margin-left: 90px;
  margin-top: 100px;
`;
const Rightside = styled.div`
  width: 100vh;
  padding: 44px;
  margin-left: 50px;
  margin-right: 20px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  position: relative;
  // width: 100%;
  // height: 100%;
`;
const Container = styled.div`
  width: 800px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
`;

const Title = styled.h2`
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid #000000;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  color: #3e3e3e;
`;

const DoubleInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

const InfoBlock = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
  width: 50%;
`;

const Label = styled.span`
  font-weight: bold;
  color: #000000;
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
  // justify-content: flex-end;
  gap: 10px;
`;
const ButtonBottom = styled.button`
  width: 100px;
  height: 40px;
  margin-left: auto;
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
const ButtonBackPage = styled.button`
  margin-right: auto;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4f4f4f;
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

const PreviewWrapper = styled.div`
  width: 50%;
  margin-top: 30px;
`;

const PreviewImage = styled.img`
  width: 450px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
