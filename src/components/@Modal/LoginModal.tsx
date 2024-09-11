import React from 'react';
import { useState } from 'react';
import { FaTimes } from "react-icons/fa";
import Link from 'next/link';

interface LoginModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, closeModal }) => {
  const [activeTab, setActiveTab] = useState(1);
  
  if (!isOpen) {
    return null;
  }

  const handleTabClick = (tab: number) => {
    setActiveTab(tab); // 탭 변경
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>
          <FaTimes />
        </button>
        {/* 로고 */}
        <div className={"flex justify-center my-3"}>
          <img src="/logo.png" width={350} alt="Logo" />
        </div>
        

        <div>
          {/* 회원 로그인 탭 */}
          <div>
            <ul className="flex flex-wrap -mb-px text-center justify-center" role="tablist">
                <li className="w-2/4">
                    <button className={`inline-block w-full py-3 rounded-t-lg ${activeTab === 1 ? 'border-2 border-b-0 ' : 'border-b-2 bg-gray-200/70'}`} onClick={() => handleTabClick(1)} type="button" role="tab" aria-selected={activeTab === 1}>회원 로그인</button>
                </li>
                <li className="w-2/4">
                    <button className={`inline-block w-full py-3 rounded-t-lg ${activeTab === 2 ? 'border-2 border-b-0 ' : 'border-b-2 bg-gray-200/70'}`}  onClick={() => handleTabClick(2)} type="button" role="tab" aria-selected={activeTab === 2}>관리자 로그인</button>
                </li>
            </ul>
          </div>

          {/* 관리자 로그인 탭 */}
          {/* <div className="> */}
            <div className="rounded-b-lg border-solid border-2 border-t-0 border-gray-200" role="tabpanel">
              <form className="py-10">
                <input type="text" placeholder='아이디' className='w-10/12 border rounded-md p-3 px-7 mb-2' />
                <input type="password" placeholder='비밀번호' className='w-10/12 border rounded-md p-3 px-7 mb-2'/>
                <div className='flex ml-9 mt-2 mb-8 text-gray-500 '>
                  <input type='checkbox' id='keep' className='mr-2 cursor-pointer h-3 w-3'/>
                  <label htmlFor='keep' className='mr-6'>
                      자동 로그인
                  </label>
                  <input type='checkbox' id='saveId' className='mr-2 cursor-pointer h-3 w-3'/>
                  <label htmlFor='saveId' className='mr-6 font-thin'>
                      아이디 저장
                  </label>
                </div>
                <div>
                  <button type='submit' className={`inline-block w-10/12 rounded-md text-white p-2 text-lg ${activeTab === 1 ? 'bg-customDarkBlue-100' : 'bg-customMint-100'}`}>로그인</button>
                </div>
              </form>
            </div>
          {/* </div> */}

          {/* 아이디/비밀번호 찾기 */}
          <div className="flex justify-around items-center text-gray-500 my-5">
            <div className='cursor-pointer'>아이디 찾기</div>
            <div className='w-0.5 h-5 bg-gray-200 border'></div>
            <div className='cursor-pointer'>비밀번호 찾기</div>
            <div className='w-0.5 h-5 bg-gray-200 border'></div>
            <Link href='/join'>회원가입</Link>
          </div>
        </div>

        {/* 소셜 로그인 */}
        <div className="social-login">
          <img src="/kakao_login.png" width={425} alt="kakao login" className="mt-5 mb-16" />
        </div>

      </div>
    </div>
  );
};

export default LoginModal;
