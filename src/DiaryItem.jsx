import React, { useContext, useRef, useState } from "react";
import { DiaryDispatchContext } from "./App";

// DiaryItem 컴포넌트 정의
const DiaryItem = ({
  id, // 일기 항목의 고유 ID
  author, // 작성자
  content, // 내용
  emotion, // 감정 점수
  created_date, // 작성일
}) => {
  const { onRemove, onEdit } = useContext(DiaryDispatchContext);

  // 상태 변수 설정: isEdit - 수정 모드인지 여부, setIsEdit - 수정 모드 설정 함수
  const [isEdit, setIsEdit] = useState(false);

  // 수정 모드 토글 함수
  const toggleIsEdit = () => {
    setIsEdit(!isEdit);
  };

  // 상태 변수 설정: localContent - 수정 중인 일기 내용, setLocalContent - 일기 내용 갱신 함수
  const [localContent, setLocalContent] = useState(content);

  // useRef를 사용하여 수정 중인 일기 내용에 대한 DOM 요소에 접근
  const localContentInput = useRef();

  // 일기 삭제 처리 함수
  const handleRemove = () => {
    // 삭제 전 확인 창을 띄우고 확인 시 삭제 함수 호출
    if (window.confirm(`${id}번째 일기를 삭제합니다.`)) {
      onRemove(id);
    }
  };

  // 수정 취소 처리 함수
  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content);
  };

  // 일기 수정 처리 함수
  const handleEdit = () => {
    // 수정된 내용의 길이가 5보다 작으면 포커스를 맞추고 함수 종료
    if (localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }

    // 수정 전 확인 창을 띄우고 확인 시 수정 함수 호출 및 수정 모드 토글
    if (window.confirm(`${id}번 째 일기를 수정하시겠습니까?`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
  };

  return (
    <div className="DiaryItem">
      <span>ID : {id}</span>
      <br />
      <span>
        작성자 : {author} | 감정점수 : {emotion}
      </span>
      <br />
      {/* 작성일을 날짜 문자열로 변환하여 표시 */}
      <span className="date">{new Date(created_date).toLocaleString()}</span>
      <div className="content">
        {/* 수정 모드인 경우 텍스트 에어리어로 수정 중인 내용 표시 */}
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            >
              {content}
            </textarea>
          </>
        ) : (
          <>{content}</>
        )}
      </div>
      {/* 수정 모드에 따라 다르게 표시되는 버튼 영역 */}
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정취소</button>
          <button onClick={handleEdit}>수정완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제하기</button>
          <button onClick={toggleIsEdit}>수정하기</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
