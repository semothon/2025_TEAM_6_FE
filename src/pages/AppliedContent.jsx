import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import { useRef, useState, useEffect } from "react";
import { VscClose } from "react-icons/vsc";
import axios from "axios";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf"; // pdf 읽는 라이브러리 불러오기
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.js?url"; // 버전 이슈로 Web Worker을 사용
//PDF 작업용 워커 파일의 경로를 URL 형태로 가져오는 코드
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc; //workerSrc는 실제로 "/assets/pdf.worker.min.js" 이런 값이 됨.

// <pdf 미리보기 구현 과정>
// pdf.js는 단순 html처럼 바로 렌더링 할 수가 없어서 worker를 통해 백그라운드에서 pdf 데이터를 해석한 뒤,
// 그걸 화면에 canvas로 그려야 된다 함.

// item의 형태
// applicationId: item.applicaitonId,
// applicationDate: item.applicationDate,
// classroom: item.classroom,
// semester: item.semester,
// status: "승인",

const AppliedContent = () => {
  const location = useLocation();
  const item = location.state?.item;
  const applicationId = item.applicationId;
  console.log("applicationId", applicationId);
  // pdf 첫 페이지를 캔버스로 이미지로 만든 url을 저장함.
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [applicationDetail, setApplicationDetail] = useState(null); // 신청 상세 정보 상태 추가

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetail(applicationId);
    }
  }, [item]);

  // 신청 상세 정보 요청
  const fetchApplicationDetail = async () => {
    try {
      const response = await axios.get(
        "https://itsmeweb.store/api/application/detail",
        {
          params: { applicationId },
          headers: { accept: "application/json" },
        }
      );
      console.log("response", response);
      if (response.data.result === "SUCCESS") {
        const detail = response.data.data;
        setApplicationDetail(detail);

        // 응답받은 URL로 PDF 미리보기 그리기
        if (detail.applicationUrl) {
          renderPdfFromUrl(detail.applicationUrl);
        }
      } else {
        console.error("에러 발생:", response.data.error);
      }
    } catch (error) {
      console.error("요청 실패:", error);
    }
  };

  // PDF URL의 첫 페이지를 캔버스로 렌더링해서 이미지로 저장하는 함수
  const renderPdfFromUrl = async (url) => {
    try {
      const loadingTask = pdfjsLib.getDocument(url);
      const pdf = await loadingTask.promise;

      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const imageUrl = canvas.toDataURL(); // canvas → 이미지 URL
      setPdfPreviewUrl(imageUrl);
    } catch (error) {
      console.error("PDF 렌더링 실패:", error);
    }
  };

  console.log("applicationDetail", applicationDetail);

  return (
    <>
      <Header role="USER" />
      <Container>
        {/* 신청 상세 정보 */}
        {applicationDetail && (
          <>
            <Title>신청 정보</Title>
            <InfoContainer>
              <InfoRow>
                <Label>신청자</Label> {applicationDetail.userName}
              </InfoRow>
              <InfoRow>
                <Label>전화번호</Label> {applicationDetail.userNumber}
              </InfoRow>
              <InfoRow>
                <Label>강의실</Label> {applicationDetail.classroom}
              </InfoRow>
              <InfoRow>
                <Label>사용 목적</Label> {applicationDetail.applicationPurpose}
              </InfoRow>
              <DoubleInfoRow>
                <InfoBlock>
                  <Label>사용 일자</Label>{" "}
                  {applicationDetail.applicationUseDate}
                </InfoBlock>
                <InfoBlock>
                  <Label>사용 시간</Label>
                  {applicationDetail.applicationStart} ~{" "}
                  {applicationDetail.applicationEnd}
                </InfoBlock>
              </DoubleInfoRow>
              <DoubleInfoRow>
                <InfoBlock>
                  <Label>신청일</Label> {applicationDetail.applicationDate}
                </InfoBlock>
                <InfoBlock>
                  <Label>상태</Label> {applicationDetail.applicationStatus}
                </InfoBlock>
              </DoubleInfoRow>
              {applicationDetail.applicationRejectReason && (
                <InfoRow>
                  <Label>반려 사유</Label>{" "}
                  {applicationDetail.applicationRejectReason}
                </InfoRow>
              )}
            </InfoContainer>
          </>
        )}
        {/* PDF 미리보기 */}
        {pdfPreviewUrl && (
          <PreviewWrapper>
            <h4>PDF 미리보기</h4>
            <PreviewImage src={pdfPreviewUrl} alt="PDF 미리보기" />
          </PreviewWrapper>
        )}
      </Container>
    </>
  );
};

export default AppliedContent;

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

const PreviewWrapper = styled.div`
  // pdf 미리보기 감싸는 애
  width: 50%;
  margin-top: 30px;
`;

const PreviewImage = styled.img`
  // pdf 미리보기 감싸는 애
  max-width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
`;
