import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from '@emotion/styled';
import Template from 'templates/Template';
import { addRoutine } from 'modules/routine';
import { routineSelector } from 'modules/hooks';
import RoutineItem from 'components/Routine/RoutineItem';
import AddExercise from 'components/Routine/AddExerciseModal';
import { BsPlusCircle } from 'react-icons/bs';
import { v4 as uuidv4 } from 'uuid';
import Button from 'components/common/Button';
import { hideScroll, unhideScroll } from 'lib/methods';

const AddRoutineButton = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  place-items: center;
  padding: 0.5rem;
  margin-top: 1rem;
  font-size: 2rem;
  b {
    font-size: 1rem;
  }
`;

const RoutineListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 0.5rem;
`;

const RoutinePage = () => {
  const routines = useSelector(routineSelector);
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(document.body.offsetWidth);
  const [visible, setVisible] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [day, setDay] = useState<number | null>(null);

  const onOpenModal = useCallback((day: number) => {
    setWindowWidth(document.body.offsetWidth);
    setDay(day);
    setModal(true);
    hideScroll();
  }, []);
  const onCloseModal = useCallback(() => {
    setModal(false);
    unhideScroll();
  }, []);

  const onSetVisible = useCallback((routineId?: string) => {
    if (routineId) {
      setVisible(routineId);
      return;
    }
    setVisible(null);
  }, []);
  const onSetEditing = useCallback((routineId?: string) => {
    if (routineId) {
      setVisible(routineId);
      setEditing(routineId);
      return;
    }
    setEditing(null);
  }, []);

  return (
    <Template>
      <AddExercise
        routineId={editing}
        day={day}
        visible={modal}
        offset={windowWidth}
        onCloseModal={onCloseModal}
      />
      <h1>루틴 목록</h1>
      <RoutineListBlock>
        {routines.map((routine) => (
          <RoutineItem
            key={routine.routineId}
            routine={routine}
            isVisible={visible === routine.routineId}
            isEditing={editing === routine.routineId}
            onOpenModal={onOpenModal}
            onSetVisible={onSetVisible}
            onSetEditing={onSetEditing}
          />
        ))}
      </RoutineListBlock>
      <AddRoutineButton>
        <Button
          onClick={() => {
            const routineId = uuidv4();
            dispatch(
              addRoutine({
                routineId,
                title: '새 루틴',
                lastModified: Date.now(),
                weekRoutine: [[], [], [], [], [], [], []],
              }),
            );
            onSetEditing(routineId);
          }}
        >
          <BsPlusCircle />
          <b>루틴 추가</b>
        </Button>
      </AddRoutineButton>
    </Template>
  );
};

export default React.memo(RoutinePage);
