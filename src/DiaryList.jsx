import { useContext } from "react";
import DiaryItem from "./DiaryItem";
import { DiaryStateContext } from "./App";

// DiaryList 컴포넌트 정의
const DiaryList = () => {
  const diaryList = useContext(DiaryStateContext);
  return (
    <div className="DiaryList">
      {/* 컴포넌트 제목 */}
      <h2>DiaryList</h2>

      {/* 현재 일기 목록의 길이를 표시하는 문구 */}
      <p>{diaryList.length}개의 일기가 있습니다.</p>

      {/* 일기 목록을 나타내는 부분 */}
      <div>
        {/* 일기 목록 배열을 순회하며 DiaryItem 컴포넌트를 렌더링 */}
        {diaryList.map((item) => (
          <DiaryItem
            key={item.id} // 고유한 키로 각 일기 항목을 식별
            {...item} // 일기 항목의 속성을 모두 DiaryItem으로 전달
          />
        ))}
      </div>
    </div>
  );
};

// 기본값으로 빈 배열을 가지는 diaryList prop을 설정
DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
