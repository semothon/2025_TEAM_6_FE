import DocumentTable from '../components/DocumentTable';
import Header from '../components/Header';
import styled from 'styled-components';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../context/userContext';

const Report = () => {
  // 로그인 정보 불러오기
  const { userData } = useContext(UserContext);
  const [approvedData, setApprovedData] = useState([]);

  useEffect(() => {
    // userId 불러오기
    const userId = userData.userId;
    // 승인된 신청서만
    const fetchData = async () => {
      try {
        const approvedRes = await axios.get(
          'https://itsmeweb.store/api/application',
          {
            params: {
              userId,
              status: 'APPROVED',
            },
            headers: { accept: 'application/json' },
          }
        );

        const approvedData = approvedRes.data?.data || [];

        const formattedData = approvedData.map((item) => ({
          applicationId: item.applicaitonId,
          applicationDate: item.applicationDate,
          classroom: item.classroom,
          semester: item.semester,
          status: '선택',
        }));

        setApprovedData(formattedData);
      } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다:', error);
      }
    };

    fetchData();
  }, [userData]);

  return (
    <>
      <Header role="USER" />
      <PageWrapper>
        <ContentWrapper>
          <Title>신청 내역</Title>

          <DocumentTable data={approvedData} />
        </ContentWrapper>
      </PageWrapper>
    </>
  );
};

export default Report;

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  margin-top: 70px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 왼쪽 정렬 */
  width: 1200px; /* DocumentTable과 동일한 너비 */
`;

const Title = styled.h3`
  margin-bottom: 20px; /* 테이블과의 간격 조정 */
  margin-top: 70px;
`;
