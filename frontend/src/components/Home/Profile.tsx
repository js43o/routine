import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { User } from 'types';
import Button from 'components/common/Button';
import { useDispatch } from 'react-redux';
import { setInfo, setProfileImage } from 'modules/user';
import useErrorMessage from 'hooks/useErrorMessage';
import ErrorMessage from 'components/common/ErrorMessage';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 430px) {
    align-items: start;
  }
  border-bottom: 1px solid ${({ theme }) => theme.background_sub};
`;

const ProfileBlock = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 1rem;
  gap: 1rem;
  @media (min-width: 430px) {
    flex-direction: row;
    gap: 1rem;
  }
  .profileImageWrapper {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ImageBlock = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  width: 128px;
  height: 128px;
  background: ${({ theme }) => theme.background_sub};
  border-radius: 50%;
  overflow: hidden;
  input {
    display: none;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .image_upload {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .buttons {
    display: flex;
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    button {
      width: 100%;
      height: 100%;
    }
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  .info {
    display: flex;
    flex-direction: column;
    .nick {
      font-size: 1.5rem;
    }
  }
  form {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  @media (min-width: 430px) {
    align-items: start;
    text-align: start;
  }
`;

const EditButton = styled(Button)`
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.background_sub};
`;

const CheckButton = styled(Button)`
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.letter_primary};
`;

const UploadImageButton = styled(Button)`
  color: white;
  font-size: 1.5rem;
  label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
`;

const RemoveImageButton = styled(Button)`
  color: ${({ theme }) => theme.red};
  font-size: 1.5rem;
`;

type ProfileProps = {
  user: User;
};

const Profile = ({ user }: ProfileProps) => {
  const dispatch = useDispatch();

  const [nickname, setNickname] = useState(user.nickname);
  const [intro, setIntro] = useState(user.intro);
  const [edit, setEdit] = useState(false);
  const { message, onError, resetError } = useErrorMessage();

  const onSubmitInfo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^[ㄱ-ㅎ가-힇A-Za-z\d]{1,10}/.test(nickname)) {
      onError('닉네임은 1-10자의 한글/영문/숫자입니다.');
      return;
    }
    dispatch(setInfo({ username: user.username, nickname, intro }));
    resetError();
    setEdit(false);
  };

  const onSubmitImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;

    const uploadFile = e.target.files[0];
    const maxSize = 1024 ** 2 * 3;

    if (uploadFile.size > maxSize) {
      onError('업로드 가능한 최대 크기는 3MB입니다.');
      return;
    }

    const formData = new FormData();
    formData.append('image', uploadFile);
    dispatch(setProfileImage({ username: user.username, image: formData }));
    e.target.value = '';
  };

  const onRemoveImage = () => {
    if (!user.profileImage || !confirm('정말 삭제하시겠습니까?')) return;
    dispatch(setProfileImage({ username: user.username, image: null }));
  };

  useEffect(() => {
    setNickname(user.nickname);
    setIntro(user.intro);
  }, [user]);

  return (
    <ProfileWrapper>
      <ProfileBlock>
        <div className="profileImageWrapper">
          <ImageBlock>
            {user.profileImage ? (
              <img src={user.profileImage} alt="profile_image" />
            ) : (
              <div className="image_upload">
                <b>사진 등록 필요</b>
                <small>(3MB 이하)</small>
              </div>
            )}
            {edit && (
              <div className="buttons">
                <UploadImageButton>
                  <label htmlFor="profileImage">
                    <FaUpload />
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => onSubmitImage(e)}
                    />
                  </label>
                </UploadImageButton>
                <RemoveImageButton onClick={onRemoveImage}>
                  <FaTrashAlt />
                </RemoveImageButton>
              </div>
            )}
          </ImageBlock>
        </div>
        {edit ? (
          <InfoBlock>
            <form onSubmit={onSubmitInfo}>
              <input
                id="nick"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                maxLength={10}
              />
              <input
                id="intro"
                type="text"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="한 줄 소개"
                maxLength={20}
              />
              <CheckButton type="submit">저장</CheckButton>
            </form>
          </InfoBlock>
        ) : (
          <InfoBlock>
            <div className="info">
              <b className="nick">{user.nickname}</b>
              <div>{user.intro || '자기소개가 없습니다.'}</div>
            </div>
            {!edit && (
              <EditButton onClick={() => setEdit(true)}>편집</EditButton>
            )}
          </InfoBlock>
        )}
      </ProfileBlock>
      <ErrorMessage message={message} />
    </ProfileWrapper>
  );
};

export default Profile;
