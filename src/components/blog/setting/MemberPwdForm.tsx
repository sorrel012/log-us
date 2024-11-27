import AlertPopup from '@/components/AlertPopup';
import { FcCancel, FcOk } from 'react-icons/fc';
import { ChangeEvent, useState } from 'react';
import { customFetch } from '@/utils/customFetch';
import { useRouter } from 'next/navigation';

export default function MemberPwdForm() {
    const router = useRouter();

    const [currPwd, setCurrPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [checkPwd, setCheckPwd] = useState('');
    const [isCorrectCurrPwd, setIsCorrectCurrPwd] = useState(false);
    const [isUsablePwd, setIsUsablePwd] = useState(false);
    const [isSame, setIsSame] = useState(false);
    const [currPwdMessage, setCurrPwdMessage] = useState('');
    const [newPwdMessage, setNewPwdMessage] = useState('');
    const [checkPwdMessage, setCheckPwdMessage] = useState('');

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('CLOSE');

    const handleConfirm = () => {
        if (popupId === 'CLOSE') {
            setPopupTitle('');
            setPopupText('');
            setShowPopup(false);
        } else if (popupId === 'REFRESH') {
            router.refresh();
        }
    };

    const handleCurrPwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCurrPwd(e.target.value);

        //TODO 현재 비밀번호 api
        const password = 'a1s2d3f4!';
        if (password === e.target.value) {
            setIsCorrectCurrPwd(true);
            setCurrPwdMessage('현재 비밀번호와 일치합니다.');
        } else {
            setIsCorrectCurrPwd(false);
            setCurrPwdMessage('현재 비밀번호와 일치하지 않습니다.');
        }
    };

    const validatePassword = (password: string) => {
        const lengthRegex = /^.{8,16}$/;
        const alphabetRegex = /[a-zA-Z]/;
        const numberRegex = /\d/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>_-]/;

        const containsAlphabet = alphabetRegex.test(password);
        const containsNumber = numberRegex.test(password);
        const containsSpecialChar = specialCharRegex.test(password);

        if (!lengthRegex.test(password)) {
            return false;
        }

        const mixCount = [
            containsAlphabet,
            containsNumber,
            containsSpecialChar,
        ].filter(Boolean).length;

        return mixCount >= 2;
    };

    const handleNewPwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPwd(e.target.value);

        if (validatePassword(e.target.value)) {
            setIsUsablePwd(true);
            setNewPwdMessage('유효한 비밀번호입니다.');
        } else {
            setIsUsablePwd(false);
            setNewPwdMessage('유효하지 않은 비밀번호입니다.');
        }
    };

    const handleCheckPwdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCheckPwd(e.target.value);

        if (newPwd === e.target.value) {
            setIsSame(true);
            setCheckPwdMessage('새 비밀번호와 일치합니다.');
        } else {
            setIsSame(false);
            setCheckPwdMessage('새 비밀번호와 일치하지 않습니다.');
        }
    };

    const handleChangePwd = async () => {
        if (!isCorrectCurrPwd) {
            setPopupTitle('현재 비밀번호가 일치하지 않습니다.');
            setPopupText('현재 비밀번호 입력 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        if (!isUsablePwd) {
            setPopupTitle('새 비밀번호 형식이 올바르지 않습니다.');
            setPopupText('형식에 맞게 다시 입력해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        if (!isSame) {
            setPopupTitle('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            setPopupText('');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        if (currPwd === newPwd) {
            setPopupTitle('새 비밀번호가 현재 비밀번호와 동일합니다.');
            setPopupText('비밀번호 변경 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        const res = await customFetch('/user', {
            queryKey: ['edit-user-info', currPwd, newPwd, checkPwd],
            method: 'PUT',
            body: { password: currPwd, newPassword: newPwd },
        });

        if (res.isError) {
            setPopupTitle('비밀번호 변경에 실패하였습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        setPopupTitle('비밀번호를 변경하였습니다.');
        setPopupText('');
        setPopupId('REFRESH');
        setShowPopup(true);
    };

    return (
        <section className="mt-10">
            <div className="mb-8 flex gap-5">
                <label htmlFor="currPwd" className="mt-1.5 w-24 font-semibold">
                    현재 비밀번호
                </label>
                <div className="flex flex-1 flex-col">
                    <input
                        type="password"
                        id="currPwd"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        value={currPwd}
                        onChange={handleCurrPwdChange}
                        placeholder="현재 비밀번호를 입력해 주세요."
                    />
                    <div
                        className={`${
                            isCorrectCurrPwd ? 'text-green-500' : 'text-red-600'
                        } mt-2 flex gap-1`}
                    >
                        {currPwd && currPwdMessage && (
                            <>
                                {isCorrectCurrPwd ? <FcOk /> : <FcCancel />}
                                <span>{currPwdMessage}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="mb-8 flex gap-5">
                <label htmlFor="newPwd" className="mt-1.5 w-24 font-semibold">
                    새 비밀번호
                </label>
                <div className="flex flex-1 flex-col">
                    <input
                        type="password"
                        id="newPwd"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        placeholder="영문, 숫자, 특수문자 중 2가지를 혼합하여 입력해 주세요.(최소 8자, 최대 16자)"
                        value={newPwd}
                        onChange={handleNewPwdChange}
                    />
                    <div
                        className={`${
                            isUsablePwd ? 'text-green-500' : 'text-red-600'
                        } mt-2 flex gap-1`}
                    >
                        {newPwd && newPwdMessage && (
                            <>
                                {isUsablePwd ? <FcOk /> : <FcCancel />}
                                <span>{newPwdMessage}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-5">
                <label htmlFor="checkPwd" className="mt-1.5 w-24 font-semibold">
                    비밀번호 확인
                </label>
                <div className="flex flex-1 flex-col">
                    <input
                        type="password"
                        id="checkPwd"
                        className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        placeholder="비밀번호를 다시 한번 입력해 주세요."
                        value={checkPwd}
                        onChange={handleCheckPwdChange}
                    />
                    <div
                        className={`${
                            isSame ? 'text-green-500' : 'text-red-600'
                        } mt-2 flex gap-1`}
                    >
                        {checkPwd && checkPwdMessage && (
                            <>
                                {isSame ? <FcOk /> : <FcCancel />}
                                <span>{checkPwdMessage}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4 text-right">
                <button
                    className="rounded bg-customBeige-100 px-4 py-2 text-md text-customBrown-100"
                    onClick={handleChangePwd}
                >
                    저장
                </button>
            </div>
            <AlertPopup
                show={showPopup}
                onConfirm={handleConfirm}
                title={popupTitle}
                text={popupText}
            />
        </section>
    );
}
