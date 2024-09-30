import { useState } from 'react';

type ModalType = 'login' | 'join' | null;

export const useModal = () => {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type : ModalType) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return { modalType, openModal, closeModal };
};