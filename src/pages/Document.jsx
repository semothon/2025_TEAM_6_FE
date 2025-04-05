import Header from '../components/Header';
import styled from 'styled-components';
import DocumentTable from '../components/DocumentTable';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const Document = () => {
  const { userData } = useContext(UserContext);
  // console.log("userData: ", userData);
  //console.log(userData.data.userId);

  // 상태 관리: 진행중(승인 대기)와 완료된 신청 내역
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [error, setError] = useState(null); // setError를 정의

  useEffect(() => {
    // userData가 준비되지 않았으면 실행하지 않음
    if (!userData) return;

    const userId = userData.userId;
    // console.log("userID:", userId);

    const fetchData = async () => {
      try {
        const baseUrl = 'https://itsmeweb.store/api/application';

        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          axios.get(baseUrl, {
            params: { userId, status: 'PENDING' },
            headers: { accept: 'application/json' },
          }),
          axios.get(baseUrl, {
            params: { userId, status: 'APPROVED' },
            headers: { accept: 'application/json' },
          }),
          axios.get(baseUrl, {
            params: { userId, status: 'REJECTED' },
            headers: { accept: 'application/json' },
          }),
        ]);

        // console.log("pendingRes", pendingRes);
        const pendingData = pendingRes.data?.data || [];
        const approvedData = approvedRes.data?.data || [];
        const rejectedData = rejectedRes.data?.data || [];

        const pendingMapped = pendingData.map((item) => ({
          applicationId: item.applicaitonId,
          applicationDate: item.applicationDate,
          classroom: item.classroom,
          semester: item.semester,
          status: '승인 대기',
        }));

        // console.log("pendingMapped", pendingMapped);

        const approvedMapped = approvedData.map((item) => ({
          applicationId: item.applicaitonId,
          applicationDate: item.applicationDate,
          classroom: item.classroom,
          semester: item.semester,
          status: '승인',
        }));

        const rejectedMapped = rejectedData.map((item) => ({
          applicationId: item.applicaitonId,
          applicationDate: item.applicationDate,
          classroom: item.classroom,
          semester: item.semester,
          status: '반려',
        }));

        setPendingData(pendingMapped);
        setCompletedData([...approvedMapped, ...rejectedMapped]);
      } catch (err) {
        console.error('신청 내역 데이터를 불러오는데 실패했습니다.', err);
        setError('데이터를 불러오지 못했습니다.');
      }
    };

    fetchData();
  }, [userData]);

  return (
    <>
      <Header role="USER" />
      <PageWrapper>
        <div>
          <h2 style={{ display: 'flex', justifyContent: 'center' }}>
            신청 내역 문서보관함
          </h2>
          <h3>진행중인 신청 내역</h3>
          <DocumentTable data={pendingData} />
          <br></br>
          <h3>완료된 신청 내역</h3>
          <DocumentTable data={completedData} />
          <br></br>
        </div>
      </PageWrapper>
    </>
  );
};

export default Document;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  // 이거 주석처리
  // height: 100vh; /* 뷰포트 전체 높이를 차지 */
  width: 99vw; /* 뷰포트 전체 너비를 차지 */
  margin-top: 50px;
`;
