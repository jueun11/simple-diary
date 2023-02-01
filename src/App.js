import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

//https://jsonplaceholder.typicode.com/comments

// const dummyList = [
//   {
//     id: 1,
//     author: "김하나",
//     content: "첫번째 내용",
//     emotion: 1,
//     create_date: new Date().getTime(),
//     //new생성자 함수로 new Date()해주면 빈괄호일경우 현재 시간을 기준으로 생성된다.
//   },
//   {
//     id: 2,
//     author: "김둘",
//     content: "두번째 내용",
//     emotion: 2,
//     create_date: new Date().getTime(),
//   },
//   {
//     id: 3,
//     author: "김셋",
//     content: "세번째 내용",
//     emotion: 3,
//     create_date: new Date().getTime(),
//   },
// ];

function App() {
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/comments"
    ).then((res) => res.json());
    const initData = res.slice(0, 20).map((el) => {
      return {
        author: el.email,
        content: el.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        create_date: new Date().getTime(),
        id: dataId.current++,
      };
    });
    setData(initData);
  };
  useEffect(() => {
    getData();
  }, []);
  const onCreate = useCallback((author, content, emotion) => {
    const create_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      create_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData((data) => [newItem, ...data]);
  }, []);

  const onRemove = useCallback((targetId) => {
    setData((data) => data.filter((el) => el.id !== targetId));
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map((el) =>
        el.id === targetId ? { ...el, content: newContent } : el
      )
    );
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((el) => el.emotion >= 3).length;
    //기분이 좋은 것은 기존 data에서 emotion값이 3이상인 것을 걸러주면 된다.
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
    //3개의 상수를 객체로 리턴해준다. {}객체리터널
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
}

export default App;
