import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";
import React, {
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useReducer,
} from "react";
import Lifecycle from "./Lifecycle";
import OptimizeTest from "./OptimizeTest";

const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state];
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

const App = () => {
  // getData 함수: 외부 API에서 데이터를 가져와 초기 데이터를 설정하는 비동기 함수
  const getData = async () => {
    // 외부 API에서 댓글 데이터를 가져오기
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());
    console.log(res);

    // 가져온 데이터 중 처음 20개를 선택하여 초기 데이터로 가공
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1, // 랜덤한 감정 값 부여 (1에서 5까지)
        created_date: new Date().getTime(), // 현재 시간을 생성 일자로 설정
        id: dataId.current++, // 고유한 ID 부여 및 증가
      };
    });

    dispatch({ type: "INIT", data: initData });
  };

  // useEffect: 컴포넌트가 마운트될 때 한 번만 getData 함수 호출
  useEffect(() => {
    getData();
  }, []);

  // 상태 변수 설정: data - 일기 데이터 배열, setData - 일기 데이터 갱신 함수
  // const [data, setData] = useState([]);

  const [data, dispatch] = useReducer(reducer, []);

  // useRef를 사용하여 각 일기 항목의 고유한 ID를 관리합니다.
  const dataId = useRef(0);

  // 일기 작성 함수 정의
  const onCreate = (author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });

    // 다음 일기 항목에 사용될 ID를 증가시킵니다.
    dataId.current += 1;
  };

  // 일기 삭제 함수 정의
  const onRemove = useCallback((targetId) => {
    dispatch({ type: "REMOVE", targetId });
  }, []);

  // 일기 수정 함수 정의
  const onEdit = useCallback((targetId, newContent) => {
    dispatch({ type: "EDIT", targetId, newContent });
  }, []);

  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  // useMemo를 사용하여 일기 분석 데이터를 계산하는 함수
  const getDiaryAnalysis = useMemo(() => {
    console.log("일기 분석 시작");

    // '감정'이 3 이상인 일기의 개수 계산
    const goodCount = data.filter((item) => item.emotion >= 3).length;

    // '감정'이 3 미만인 일기의 개수 계산
    const badCount = data.length - goodCount;

    // '감정'이 3 이상인 일기의 비율 계산 (백분율)
    const goodRatio = ((goodCount / data.length) * 100).toFixed(1);

    // 결과를 객체로 반환
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <Lifecycle />
          <OptimizeTest />
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 갯수 : {goodCount}</div>
          <div>기분 나쁜 일기 갯수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}%</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
};

export default App;
