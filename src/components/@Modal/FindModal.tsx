import React from 'react';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FindModal {
    isOpen: boolean;
    closeModal: () => void;
    findType : string | null;
}

const FindModal: React.FC<FindModal> = ({ isOpen, closeModal, findType }) => {
    const [activeTab, setActiveTab] = useState(1);
    const [activePwCode, setActivePwCode] = useState(false);
    const [pwCode, setPwCode] = useState('');
    const [findFormData, setFormData] = useState({
        name : '',
        email : '',
        id : '',
        password1 : '',
        password2 : '',
    });

    useEffect(() => {
        if (findType === 'id') {
            setActiveTab(1);
        } else if (findType === 'pw') {
            setActiveTab(2);
        }
    }, [findType]);

    if (!isOpen) {
        return null;
    }

    const handleTabClick = (tab: number) => {
        setActiveTab(tab); // 탭 변경
        setFormData({ name: '', email: '', id: '', password1: '', password2: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (activeTab === 1) {
            // 1. 입력한 이름과 이메일이 존재하는지 확인
            // 2. 확인되면 이메일 아이디 전송
            alert('이메일로 아이디 전송');
        } else {
            // 1. 입력한 이름, 이메일, 아이디 존재하는지 확인
            // 2. 확인되면 비밀번호 코드 전송
            // 3. 전송 후 변경 코드 입력창 활성화 (현재 여기만 구현)
            alert('이메일로 비밀번호 코드 전송');
            setActivePwCode(true);
        }
    };

    const confirmPwCode = () => {
        // 1. 비밀번호 맞는지 확인
        // 2. 맞으면 새로운 비밀번호 입력창 띄우게
        

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
                        <form onSubmit={sendEmail}>
                            <div>
                                <ul className='flex flex-wrap -mb-px text-center justify-center' role='tablist'>
                                    <li className='w-2/4'>
                                        <button className={`inline-block w-full py-2 h-8 rounded-t-lg text-sm ${activeTab === 1 ? 'border-2 border-b-0' : 'border-b-2 bg-gray-200/70'}`} onClick={() => handleTabClick(1)} type='button' role='tab' aria-selected={activeTab === 1}>아이디 찾기</button>
                                    </li>
                                    <li className='w-2/4'>
                                        <button className={`inline-block w-full py-2 h-8 rounded-t-lg text-sm ${activeTab === 2 ? 'border-2 border-b-0' : 'border-b-2 bg-gray-200/70'}`}  onClick={() => handleTabClick(2)} type='button' role='tab' aria-selected={activeTab === 2}>비밀번호 찾기</button>
                                    </li>
                                </ul>
                            </div>

                            <div className='rounded-b-lg border-solid border-2 border-t-0 border-gray-200 mb-16' role='tabpanel'>
                                <input type='text' placeholder='이름' name='name' value={findFormData.name} onChange={handleInputChange} className='w-10/12 border rounded-md p-3 px-7 h-10 my-2 mt-10 text-sm' />
                                <input type='text' placeholder='이메일' name='email' value={findFormData.email} onChange={handleInputChange} className='w-10/12 border rounded-md p-3 px-7 h-10 my-2 text-sm' />
                                {activeTab === 2 ? <input type='text' name='id' placeholder='아이디' value={findFormData.id} onChange={handleInputChange} className='w-10/12 border rounded-md p-3 px-7 h-10 my-2 text-sm' /> : <></>}
                                <button type='submit' className={`inline-block w-10/12 rounded-md text-white px-5 py-3 text-md my-3 bg-customDarkBlue-200 ${activeTab === 1 ? 'mb-6' : ''}`}>
                                    {activeTab === 1 ?  '이메일로 아이디 전송' : '이메일로 비밀번호 코드 전송'}
                                </button>
                                {activeTab === 2 && activePwCode && (
                                    <div className='w-full mb-6'>
                                        <input type='text' placeholder='비밀번호 변경 코드' value={pwCode} onChange={(e) => setPwCode(e.target.value)} className='w-8/12 border rounded-md p-3 px-7 h-10 my-2 text-sm' />
                                        <button onSubmit={confirmPwCode} className='bg-customLightBlue-100 px-4 py-3 rounded-md ml-1 text-sm text-white'>
                                            확인
                                        </button>
                                    </div> 
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>  
        </div>
    );
};

export default FindModal;
