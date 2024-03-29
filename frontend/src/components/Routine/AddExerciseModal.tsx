import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/styled';
import { addExercise } from 'modules/user';
import { Exercise, ExerciseItem } from 'types';
import Button from 'components/common/Button';
import SubmitButtons from 'components/common/SubmitButtons';
import useErrorMessage from 'hooks/useErrorMessage';
import useAddExercise from 'hooks/useAddExercise';
import { getExercises } from 'lib/api';
import LoadingIndicator from 'components/common/LoadingIndicator';
import ErrorMessage from 'components/common/ErrorMessage';
import Modal from 'components/common/Modal';
import InputConfirm from 'components/common/InputConfirm';
import { TARGET_KOR_NAME } from 'lib/constants';

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border_main};
  input {
    width: 100%;
  }
`;

const CategoryListBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
  width: 100%;
`;

const CategoryItemBlock = styled(Button)<{ checked: number }>`
  padding: 0.25rem;
  border: 1px solid
    ${({ checked, theme }) => (checked ? 'transparent' : theme.border_main)};
  background: ${({ checked, theme }) =>
    checked ? theme.primary : theme.background_main};
  color: ${({ checked, theme }) =>
    checked ? theme.letter_primary : theme.letter_main};
`;

const ExerciseListBlock = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 100%;
  padding: 0.25rem;
  background: ${({ theme }) => theme.background_sub};
  overflow-y: scroll;
`;

const ExerciseItemBlock = styled.button<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background: ${({ isSelected, theme }) =>
    isSelected ? theme.primary : theme.background_main};
  color: ${({ isSelected, theme }) => isSelected && theme.letter_primary};
  span {
    color: ${({ isSelected, theme }) =>
      isSelected ? theme.letter_primary : theme.letter_main};
  }
  .exercise-name {
    font-weight: 500;
  }
  .target-name {
    font-size: 0.875rem;
  }
`;

const FooterBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.border_main};
`;

type AddExerciseProps = {
  routineId: string | null;
  dayIdx: number | null;
  isVisible: boolean;
  onCloseModal: () => void;
};

const AddExerciseModal = ({
  routineId,
  dayIdx,
  isVisible,
  onCloseModal,
}: AddExerciseProps) => {
  const dispatch = useDispatch();
  const {
    state: { category, selected, inputs },
    onSetCategory,
    onSelectExercise,
    onChangeInput,
    checkInputs,
  } = useAddExercise();
  const { message, onError, resetError } = useErrorMessage();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState('');

  const onAddExercise = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!routineId || dayIdx === null || !selected) return;

    const error = checkInputs();
    if (error) {
      onError(error);
      return;
    }

    const exercise: ExerciseItem = {
      name: selected,
      weight: inputs.weight,
      numberOfTimes: inputs.numberOfTimes,
      numberOfSets: inputs.numberOfSets,
    };
    dispatch(addExercise({ routineId, dayIdx, exercise }));
    onClose();
  };

  const onClose = () => {
    resetError();
    onCloseModal();
  };

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        const response = await getExercises();
        setExercises(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    loadExercise();
  }, []);

  return (
    <Modal isVisible={isVisible}>
      <HeaderBlock>
        <h2>운동 목록</h2>
        <CategoryListBlock>
          {Object.entries(TARGET_KOR_NAME).map(([eng, kor]) => (
            <CategoryItemBlock
              checked={category === eng ? 1 : 0}
              onClick={() => onSetCategory(eng)}
              key={eng}
            >
              {kor}
            </CategoryItemBlock>
          ))}
        </CategoryListBlock>
        <input
          type="text"
          onChange={onChangeName}
          value={name}
          placeholder="이름으로 찾기..."
        />
      </HeaderBlock>
      {exercises.length > 0 ? (
        <ExerciseListBlock>
          {exercises
            .filter((exercise) =>
              category === 'all' ? true : exercise.category.includes(category),
            )
            .filter((exercise) =>
              exercise.name
                .replaceAll(' ', '')
                .includes(name.replaceAll(' ', '')),
            )
            .map((exercise) => (
              <li key={exercise.name}>
                <ExerciseItemBlock
                  onClick={() => onSelectExercise(exercise)}
                  isSelected={selected === exercise.name}
                >
                  <span className="exercise-name">{exercise.name}</span>
                  <div>
                    {exercise.part.map((item) => (
                      <span key={item} className="target-name">
                        #{item}{' '}
                      </span>
                    ))}
                  </div>
                </ExerciseItemBlock>
              </li>
            ))}
        </ExerciseListBlock>
      ) : (
        <LoadingIndicator />
      )}
      <FooterBlock>
        <InputConfirm onSubmit={onAddExercise}>
          <div className="weight">
            <label htmlFor="weight">중량</label>
            <input
              id="weight"
              className="count"
              type="number"
              min={0}
              max={999}
              value={inputs.weight.toString()}
              onChange={(e) => onChangeInput('CHANGE_WEIGHT', e)}
            />
            kg
          </div>
          <div className="numOfTimes">
            <label htmlFor="numOfTimes">횟수</label>
            <input
              id="numOfTimes"
              className="count"
              type="number"
              min={0}
              max={999}
              value={inputs.numberOfTimes.toString()}
              onChange={(e) => onChangeInput('CHANGE_NUM_OF_TIMES', e)}
            />
            회
          </div>
          <div className="numOfSets">
            <label htmlFor="numOfSets">세트 수</label>
            <input
              id="numOfSets"
              className="count"
              type="number"
              min={0}
              max={20}
              value={inputs.numberOfSets.toString()}
              onChange={(e) => onChangeInput('CHANGE_NUM_OF_SETS', e)}
            />
            세트
          </div>
          <SubmitButtons onClose={onClose} />
        </InputConfirm>
        <ErrorMessage message={message} />
      </FooterBlock>
    </Modal>
  );
};

export default React.memo(AddExerciseModal);
