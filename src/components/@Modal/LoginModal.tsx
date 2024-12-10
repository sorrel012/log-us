import React from 'react';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { login } from '@/utils/Auth'; 
import { loginAuthStore } from '@/constants/loginAuthStore';

interface LoginModalProps {
  isOpen: boolean;
  closeModal: () => void;
  openJoinModal : () => void;
  openFindModal : (type : string) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, closeModal, openJoinModal, openFindModal }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [id, setId] = useState(localStorage.getItem('savedId') || '');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const setLoginInfo = loginAuthStore((state) => state.setAuthInfo);

  useEffect(() => {
    const savedAutoLogin = localStorage.getItem('autoLogin') === 'true';
    const savedAccessToken = localStorage.getItem('accessToken');

    if (savedAutoLogin && savedAccessToken) {
      // setLoginInfo(/* 기존에 저장된 사용자 정보 및 토큰 */);
    }
  }, []);
  
  if (!isOpen) {
    return null;
  }

  const handleTabClick = (tab: number) => {
    setActiveTab(tab); // 탭 변경
    setId('');
    setPassword('');
  };

  const handleSubmit = async (event : React.FormEvent) => {
    event.preventDefault();
    try {
      
      // 아이디 저장 기능
      if (saveId) {
        localStorage.setItem('savedId', id);
      } else {
        localStorage.removeItem('savedId');
      }
      
      // 실제 로그인 기능
      const { userId, isAdmin, accessToken, refreshToken } = await login(id, password); // 서버로부터 유저 아이디와 토큰 받아옴
      setLoginInfo(userId, isAdmin, accessToken, refreshToken); // Zustand에 유저 정보와 토큰 저장
      
      // 자동 로그인 기능
      if (autoLogin) {
        localStorage.setItem('autoLogin', 'true');
        localStorage.setItem('accessToken', accessToken);
      } else {
        localStorage.removeItem('autoLogin');
        localStorage.removeItem('accessToken');
      }

      // 임시로 alert 창, 나중에는 모달 닫고 main으로 이동
      alert('로그인 성공!!');

    } catch (err) {
      alert('로그인 실패');
    }
  };

  return (
      <div className='modal-backdrop' onClick={closeModal}>
        <motion.div initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} exit={{ y: -100, opacity: 0 }}>
          <div className='modal-content font-default' onClick={(e) => e.stopPropagation()}>
            <button className='close-btn' onClick={closeModal}>
              <FaTimes />
            </button>
            {/* 로고 */}
            <div className='flex justify-center my-3'>
              <img src='/logo.png' width={230} alt='Logo' />
            </div>
            

            <div className='w-8/12'>
              <div>
                <ul className='flex flex-wrap -mb-px text-center justify-center' role='tablist'>
                    <li className='w-2/4'>
                        <button className={`inline-block w-full py-2 h-8 rounded-t-lg text-sm ${activeTab === 1 ? 'border-2 border-b-0 font-semibold' : 'border-b-2 bg-gray-200/70'}`} onClick={() => handleTabClick(1)} type='button' role='tab' aria-selected={activeTab === 1}>회원 로그인</button>
                    </li>
                    <li className='w-2/4'>
                        <button className={`inline-block w-full py-2 h-8 rounded-t-lg text-sm ${activeTab === 2 ? 'border-2 border-b-0 font-semibold' : 'border-b-2 bg-gray-200/70'}`}  onClick={() => handleTabClick(2)} type='button' role='tab' aria-selected={activeTab === 2}>관리자 로그인</button>
                    </li>
                </ul>
              </div>

              {/* 로그인 박스 */}
                <div className={`rounded-b-lg border-solid border-2 border-t-0 border-gray-200 ${activeTab == 2 ? 'mb-16' : ''}`} role='tabpanel'>
                  <form className='py-6' onSubmit={handleSubmit}>
                    <input type='text' placeholder='아이디' value={id} onChange={(e) => setId(e.target.value)} className='w-10/12 border rounded-md p-3 px-7 h-10 mb-2' />
                    <input type='password' placeholder='비밀번호' value={password} onChange={(e) => setPassword(e.target.value)} className='w-10/12 border rounded-md p-3 px-7 h-10 mb-2'/>
                    <div className='flex ml-9 mt-3 mb-6 text-gray-500 '>
                      <input type='checkbox' id='keep' checked={autoLogin} onChange={() => setAutoLogin(!autoLogin)} className="mr-1.5 cursor-pointer h-3 w-3 appearance-none border-2 border-customLightBlue-100 rounded-sm mt-1 checked:bg-customLightBlue-200 checked:appearance-auto"/>
                      <label htmlFor='keep' className='mr-6 text-sm'>
                          자동 로그인
                      </label>
                      <input type='checkbox' id='saveId' checked={saveId} onChange={()=>setSaveId(!saveId)} className='mr-1.5 cursor-pointer h-3 w-3 appearance-none border-2 border-customLightBlue-100 rounded-sm mt-1 checked:bg-customLightBlue-200 checked:appearance-auto'/>
                      <label htmlFor='saveId' className='mr-6 font-thin text-sm'>
                          아이디 저장
                      </label>
                    </div>
                    <div>
                      <button type='submit' className={`inline-block w-10/12 rounded-md text-white p-2 text-lg ${activeTab === 1 ? 'bg-customDarkBlue-100' : 'bg-customMint-100'}`}>로그인</button>
                    </div>
                  </form>
                </div>

              {/* 아이디/비밀번호 찾기 */}
              {activeTab == 1 && (
                <div className='flex justify-around items-center text-gray-500 my-5'>
                  <div className='cursor-pointer text-sm' onClick={() => openFindModal('id')}>아이디 찾기</div>
                  <div className='w-0.5 h-5 bg-gray-200 border'></div>
                  <div className='cursor-pointer text-sm' onClick={() => openFindModal('pw')}>비밀번호 찾기</div>
                  <div className='w-0.5 h-5 bg-gray-200 border'></div>
                  <div className='cursor-pointer text-sm' onClick={openJoinModal}>회원가입</div>
                </div>
              )}
            </div>

            {/* 소셜 로그인 */}
            {activeTab == 1 && (
              <div className='social-login'>
                <img src='/kakao_login.png' width={330} alt='kakao login' className='mt-5' />
                <img src='/naver_login.png' width={330} alt='kakao login' className='mt-3' />
                <img src='/google_login.png' width={330} alt='kakao login' className='mt-3 mb-10' />
              </div>
            )}
          </div>
        </motion.div>  
      </div>
  );
};

export default LoginModal;
