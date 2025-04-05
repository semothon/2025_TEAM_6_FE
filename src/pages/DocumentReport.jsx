import Header from "../components/Header";
import styled from "styled-components";
import DocumentTable from "../components/DocumentTable";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";

const DocumentReport = () => {
  // userId를 위해 Context로 로그인 내용 받아오기
  const { userData } = useContext(UserContext);

  // 상태 관리: 진행중(승인 대기)와 완료된 결과보고서 내역
  const [pendingReport, setPendingReport] = useState([]);
  const [completedReport, setCompletedReport] = useState([]);
  const [error, setError] = useState(null); // setError를 정의

  useEffect(() => {
    // userData가 준비되지 않았으면 실행하지 않음
    if (!userData) return;

    const userId = userData.userId;

    const fetchData = async () => {
      try {
        const baseUrl = "https://itsmeweb.store/api/report";

        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          axios.get(baseUrl, {
            params: { userId, status: "PENDING" },
            headers: { accept: "application/json" },
          }),
          axios.get(baseUrl, {
            params: { userId, status: "APPROVED" },
            headers: { accept: "application/json" },
          }),
          axios.get(baseUrl, {
            params: { userId, status: "REJECTED" },
            headers: { accept: "application/json" },
          }),
        ]);

        const pendingReport = pendingRes.data?.data || [];
        const approvedReport = approvedRes.data?.data || [];
        const rejectedReport = rejectedRes.data?.data || [];

        console.log("pendingReport", pendingReport);

        const pendingMapped = pendingReport.map((item) => ({
          reportId: item.reportId,
          applicationId: item.applicaitonId,
          reportUrl: item.reportUrl,
          reportSubmittedAt: item.reportSubmittedAt,
          classroom: item.classroom,
          semester: item.semester,
          status: "승인 대기",
        }));

        const approvedMapped = approvedReport.map((item) => ({
          reportId: item.reportId,
          applicationId: item.applicaitonId,
          reportUrl: item.reportUrl,
          reportSubmittedAt: item.reportSubmittedAt,
          classroom: item.classroom,
          semester: item.semester,
          status: "승인",
        }));

        const rejectedMapped = rejectedReport.map((item) => ({
          reportId: item.reportId,
          applicationId: item.applicaitonId,
          reportUrl: item.reportUrl,
          reportSubmittedAt: item.reportSubmittedAt,
          classroom: item.classroom,
          semester: item.semester,
          status: "반려",
        }));
        setPendingReport(pendingMapped);
        setCompletedReport([...approvedMapped, ...rejectedMapped]);
      } catch (err) {
        console.error("신청 내역 데이터를 불러오는데 실패했습니다.", err);
        setError("데이터를 불러오지 못했습니다.");
      }
    };

    fetchData();
  }, [userData]);

  return (
    <>
      <Header role="USER" />
      <PageWrapper>
        <div>
          <h2 style={{ display: "flex", justifyContent: "center" }}>
            결과보고서 문서보관함
          </h2>
          <h3>진행중인 결과보고서 신청내역</h3>
          <DocumentTable data={pendingReport} />
          <br></br>
          <h3>완료된 결과보고서 내역</h3>
          <DocumentTable data={completedReport} />
          <br></br>
        </div>
      </PageWrapper>
    </>
  );
};

export default DocumentReport;

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 뷰포트 전체 높이를 차지 */
  width: 99vw; /* 뷰포트 전체 너비를 차지 */
  margin-top: 20px;
`;
