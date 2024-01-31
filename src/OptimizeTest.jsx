import React, { useEffect, useState } from "react";

const CounterA = React.memo(({ count }) => {
  useEffect(() => {
    console.log(`CounterA update: ${count}`);
  });

  return <div>{count}</div>;
});

CounterA.displayName = "CounterA";

const CounterB = ({ obj }) => {
  useEffect(() => {
    console.log(`CounterB update: ${obj.count}`);
  });

  return <div>{obj.count}</div>;
};

CounterB.displayName = "CounterA";

const areEqual = (prevProps, nextProps) => {
  return prevProps.obj.count === nextProps.obj.count;
};

const MemoizedCounterB = React.memo(CounterB, areEqual);

const OptimizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1,
  });

  return (
    <div>
      <h2>Counter A</h2>
      <CounterA count={count} />
      <button
        onClick={() => {
          setCount(count);
        }}
      >
        A button
      </button>
      <h2>Counter B</h2>
      <MemoizedCounterB obj={obj} />
      <button
        onClick={() => {
          setObj({ count: obj.count });
        }}
      >
        B button
      </button>
    </div>
  );
};

export default OptimizeTest;
