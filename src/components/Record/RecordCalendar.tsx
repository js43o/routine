import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { userSelector } from 'modules/hooks';
import { dateToString } from 'lib/methods';
import palette from 'lib/palette';
import { CompleteItem } from 'modules/user';
import { ExerciseItem } from 'modules/routine';
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md';
import { FaRegCalendarCheck } from 'react-icons/fa';
import Button from 'lib/Button';

const RecordCalendarBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarList = styled.ul`
  display: grid;
  place-items: center;
  row-gap: 1rem;
  grid-template-columns: repeat(7, 1fr);
  width: 100%;
  padding: 1rem 0.5rem;
  border: 1px solid ${palette.grey_main};
  border-radius: 0.5rem;
  @media (min-width: 430px) {
    row-gap: 2rem;
    padding: 2rem 0.5rem;
  }
  .red {
    color: ${palette.red};
  }
  .blue {
    color: ${palette.blue};
  }
`;

const CalendarItem = styled.li<{ performed: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0.25rem;
  border-radius: 50%;
  background: ${(props) => (props.performed ? palette.green_main : '')};
  font-size: 1rem;
  font-weight: bold;
  transition: background 0.2s;
  cursor: pointer;
  &:nth-of-type(7n + 1) {
    color: ${palette.red};
  }
  &:nth-of-type(7n) {
    color: ${palette.blue};
  }
  &:hover {
    background: ${(props) =>
      props.performed ? palette.yellow_sub : palette.grey_sub};
  }
  @media (min-width: 430px) {
    font-size: 1.25rem;
    width: 2.5rem;
    height: 2.5rem;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  .title {
    display: flex;
    gap: 0.5rem;
    svg {
      font-size: 1.5rem;
      transform: translateY(10%);
    }
  }
`;

const PrevButton = styled(MdNavigateBefore)`
  font-size: 2.5rem;
  border-radius: 50%;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const NextButton = styled(MdNavigateNext)`
  font-size: 2.5rem;
  border-radius: 50%;
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const RecordViewBlock = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${(props) => `${props.top}px`};
  left: ${(props) => `${props.left}px`};
  z-index: 200;
  padding: 0.25rem;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.25);
  transform: translate(-50%);
  ul {
    max-width: 6rem;
    max-height: 15rem;
    overflow-y: scroll;
    li {
      display: flex;
      flex-direction: column;
      place-items: center;
      padding: 0.25rem;
      span {
        font-size: 0.85rem;
      }
    }
    li + li {
      border-top: 1px solid #eeeeee;
    }
  }
  .triangle {
    position: absolute;
    top: -5px;
    left: 50%;
    content: '';
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid white;
    transform: translate(-50%) scaleY(1.25);
  }
  @media (min-width: 430px) {
    top: ${(props) => `${props.top + 10}px`};
    ul {
      max-width: 8rem;
    }
  }
  @media (min-width: 768px) {
    ul {
      max-width: 12rem;
    }
  }
`;

type View = {
  top: number;
  left: number;
  data: ExerciseItem[];
};

const RecordCalendar = () => {
  const users = useSelector(userSelector);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [records, setRecords] = useState<CompleteItem[]>([]);
  const [view, setView] = useState<View>({ top: 0, left: 0, data: [] });

  window.onresize = () => {
    if (view.data.length === 0) return;
    setView({ ...view, data: [] });
  };

  document.onclick = (e: MouseEvent) => {
    if ((e.target as Element).closest('li')) return;
    setView({ ...view, data: [] });
  };

  const increaseMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else setMonth(month + 1);
  };

  const decreaseMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else setMonth(month - 1);
  };

  const setDateNow = () => {
    setYear(new Date().getFullYear());
    setMonth(new Date().getMonth());
  };

  const onView = (e: React.MouseEvent) => {
    const elem = (e.target as HTMLLIElement).closest('li');
    if (!elem || !elem.textContent) return;

    const info = records.find((r) => r.date === elem.textContent);
    if (!info) return;

    const pos = elem.getBoundingClientRect();
    setView({
      top: pos.top + window.pageYOffset + 28,
      left: pos.left + window.pageXOffset + elem.clientWidth / 2,
      data: info.list,
    });
  };

  useEffect(() => {
    const firstDate = new Date(year, month);
    const tempRecords: CompleteItem[] = [];
    firstDate.setDate(1);

    for (let i = 0; i < 7; i += 1)
      if (i < firstDate.getDay())
        tempRecords.push({
          date: `${-i}`,
          list: [],
        });

    while (firstDate.getMonth() === month) {
      const r = users.completes.find((c) => c.date === dateToString(firstDate));
      tempRecords.push({
        date: `${firstDate.getDate()}`,
        list: r ? r.list : [],
      });
      firstDate.setDate(firstDate.getDate() + 1);
    }
    setRecords(tempRecords);
    setView({ ...view, data: [] });

    return () => {
      document.onclick = null;
    };
  }, [year, month]);

  return (
    <RecordCalendarBlock>
      {view.data.length > 0 && (
        <RecordViewBlock top={view.top} left={view.left}>
          <div className="triangle" />
          <ul>
            {view.data.map((d) => (
              <li>
                <b>{d.exercise.name}</b>
                <span>
                  {d.weight}kg, {d.numberOfTimes} x {d.numberOfSets}
                </span>
              </li>
            ))}
          </ul>
        </RecordViewBlock>
      )}
      <CalendarHeader>
        <Button onClick={decreaseMonth}>
          <PrevButton />
        </Button>
        <div className="title">
          <h1>
            {year}.{month + 1}
          </h1>
          <Button onClick={setDateNow}>
            <FaRegCalendarCheck />
          </Button>
        </div>
        <Button onClick={increaseMonth}>
          <NextButton />
        </Button>
      </CalendarHeader>
      <CalendarList>
        <span className="red">일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span className="blue">토</span>
        {records.map((d) => (
          <CalendarItem
            key={d.date}
            performed={d.list.length > 0}
            onClick={(e) => onView(e)}
          >
            {+d.date > 0 && d.date}
          </CalendarItem>
        ))}
      </CalendarList>
    </RecordCalendarBlock>
  );
};

export default RecordCalendar;