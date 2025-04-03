import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import UserHeader from '../components/Header/UserHeader';
import { useRef, useState } from 'react';
import { VscClose } from 'react-icons/vsc';

import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'; // pdf 읽는 라이브러리 불러오기
import workerSrc from 'pdfjs-dist/legacy/build/pdf.worker.min.js?url'; // 버전 이슈로 Web Worker을 사용
//PDF 작업용 워커 파일의 경로를 URL 형태로 가져오는 코드
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc; //workerSrc는 실제로 "/assets/pdf.worker.min.js" 이런 값이 됨.

// <pdf 미리보기 구현 과정>
// pdf.js는 단순 html처럼 바로 렌더링 할 수가 없어서 worker를 통해 백그라운드에서 pdf 데이터를 해석한 뒤,
// 그걸 화면에 canvas로 그려야 된다 캄.

const AppliedContent = () => {
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [selectedOne, setSelectedOne] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // pdf 첫 페이지를 캔버스로 이미지로 만든 url을 저장함.

  const onSelectFile = (e) => {
    e.preventDefault();

    if (!e.target.files) return;

    const selectedFiles = e.target.files;

    setSelectedFiles(selectedFiles);

    // 브라우저 상에 보여질 파일 이름 리스트 업데이트
    const fileArray = Array.from(selectedFiles).map((file) => file.name);
    setSelectedOne((prev) => [...prev, ...fileArray]);

    // 최신 업로드된 파일이 PDF면 미리보기 렌더링(두 개 이상이면 마지막 파일만)
    const latestFile = selectedFiles[selectedFiles.length - 1];
    if (latestFile && latestFile.type === 'application/pdf') {
      const reader = new FileReader();

      reader.onload = async function () {
        // pdf 첫 페이지 -> canvas로 변환 -> img로 변환
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        const page = await pdf.getPage(1); // 첫 페이지 가져오기
        const viewport = page.getViewport({ scale: 1.5 }); // 확대 비율 설정

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const imageUrl = canvas.toDataURL(); // canvas를 이미지로 변환
        setPdfPreviewUrl(imageUrl); // 상태에 저장
      };

      reader.readAsArrayBuffer(latestFile);
    }
    e.target.value = ''; // 다시 업로드 할 수 있게 초기화
  };

  const attachFile = // 파일 목록 출력
    selectedOne &&
    selectedOne.map((file, index) => (
      <AttFile key={index}>
        <div>{file}</div>
        <button
          onClick={() => {
            setSelectedOne(selectedOne.filter((e) => e !== file));
            setPdfPreviewUrl(null); // 삭제 시 미리보기 초기화 (선택)
          }}
        >
          <VscClose size="17" />
        </button>
      </AttFile>
    ));

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <UserHeader />
      <Container>
        <div>
          <p>pdf 파일을 미리보기로 띄워볼까나 ㅋ</p>
          <InfoRow>
            <Label>첨부파일</Label>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {selectedOne.length !== 0 ? (
                <span>{attachFile}</span>
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
                accept=".pdf, .doc, .docx"
              />
            </div>
          </InfoRow>
          {/* PDF 미리보기 영역 */}
          {pdfPreviewUrl && (
            <PreviewWrapper>
              <h4>PDF 미리보기</h4>
              <PreviewImage src={pdfPreviewUrl} alt="PDF 미리보기" />
            </PreviewWrapper>
          )}
        </div>
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
  background: ${(props) => (props.primary ? '#1d2951' : '#555')};
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
