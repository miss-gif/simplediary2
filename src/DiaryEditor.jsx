import React, { useEffect, useState, useRef } from "react";
import "./App.css";

// 일기 작성기 컴포넌트 정의
const DiaryEditor = ({ onCreate }) => {
  useEffect(() => {
    console.log("DiaryEditor 렌더");
  });

  // useRef를 사용하여 DOM 요소에 접근하기 위한 참조 생성
  const authorInput = useRef();
  const contentInput = useRef();

  // 상태 변수 설정: state - 작성된 일기 정보, setState - 일기 정보 갱신 함수
  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  // 입력 값이 변경될 때마다 상태를 업데이트하는 함수
  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  // 일기 저장 버튼 클릭 시 수행되는 함수
  const handleSubmit = () => {
    // 작성자의 길이가 1보다 작으면 포커스를 맞추고 함수 종료
    if (state.author.length < 1) {
      authorInput.current.focus();
      return;
    }

    // 일기 내용의 길이가 5보다 작으면 포커스를 맞추고 함수 종료
    if (state.content.length < 5) {
      contentInput.current.focus();
      return;
    }

    // 부모 컴포넌트로부터 전달된 onCreate 함수 호출하여 일기 저장
    onCreate(state.author, state.content, state.emotion);

    // 저장 완료 알림을 띄우고 상태 초기화
    alert("저장되었습니다!");
    setState({
      author: "",
      content: "",
      emotion: 1,
    });
  };

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        {/* 작성자 입력란 */}
        <input
          ref={authorInput}
          type="text"
          name="author"
          value={state.author}
          onChange={handleChangeState}
        />
        <div>
          {/* 일기 내용 입력란 */}
          <textarea
            ref={contentInput}
            name="content"
            value={state.content}
            onChange={handleChangeState}
          ></textarea>
        </div>
      </div>
      <div>
        <p>오늘의 감정 점수</p>
        {/* 감정 점수 선택 드롭다운 */}
        <select
          name="emotion"
          value={state.emotion}
          onChange={handleChangeState}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div>
        {/* 저장 버튼 */}
        <button onClick={handleSubmit}>저장하기</button>
      </div>
    </div>
  );
};

export default React.memo(DiaryEditor);
