import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { customFetch } from '@/utils/customFetch';
import { Member } from '@/components/sidebar/UserProfile';
import Image from 'next/image';
import PersonIcon from '@/components/icons/PersonIcon';

export interface AddMemberPopupProps {
    show: boolean;
    onConfirm: (member: Partial<Member>) => void;
    onCancel: () => void;
}

const popupVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.15,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15,
            ease: 'easeOut',
        },
    },
};

export default function AddMemberPopup({
    show,
    onConfirm,
    onCancel,
}: AddMemberPopupProps) {
    const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
        null,
    );
    const [email, setEmail] = useState('');
    const [isClicked, setIsClicked] = useState(false);
    const [member, setMember] = useState<Partial<Member>>();

    useEffect(() => {
        setModalContainer(document.getElementById('modal'));
    }, []);

    if (!modalContainer) {
        return null;
    }

    const handleEmail = (e) => {
        setIsClicked(false);
        setEmail(e.target.value);
    };

    const handleGetMember = async () => {
        setIsClicked(true);

        const res = await customFetch<Member>('/user/email', {
            queryKey: ['email', email],
            params: { email },
        });

        if (res.isError) {
            setMember(null);
        } else {
            setMember(res.data);
        }
    };

    const handleCancel = () => {
        setEmail('');
        onCancel();
    };

    const handleAdd = () => {
        setEmail('');
        setMember(null);
        setIsClicked(false);
        onConfirm(member);
    };

    return createPortal(
        <AnimatePresence>
            {show && (
                <motion.div
                    key="container"
                    className="popup font-default"
                    exit="exit"
                    variants={popupVariants}
                >
                    <motion.div
                        key="popup"
                        className="member-container"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={popupVariants}
                    >
                        <div className="flex items-baseline gap-3 border-b border-solid border-customLightBlue-100 pb-5">
                            <label className="text-md font-bold">이메일</label>
                            <div className="flex w-full flex-1 items-center">
                                <input
                                    type="email"
                                    className="flex-1 rounded-l border border-customLightBlue-100 p-2"
                                    placeholder="초대할 멤버의 이메일 주소를 입력해 주세요."
                                    value={email}
                                    onChange={handleEmail}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleGetMember();
                                        }
                                    }}
                                />
                                <button
                                    className="rounded-y rounded-r border-y border-r border-customLightBlue-100 px-4 py-2.5 text-customLightBlue-200"
                                    onClick={handleGetMember}
                                >
                                    조회
                                </button>
                            </div>
                        </div>
                        {member ? (
                            <div className="flex items-center gap-2">
                                <>
                                    {member.imgUrl && (
                                        <div className="relative h-10 w-10">
                                            <Image
                                                src={member.imgUrl}
                                                alt={`${member.nickname}'s photo`}
                                                fill
                                            />
                                        </div>
                                    )}
                                    {!member.imgUrl && (
                                        <PersonIcon size="size-10" />
                                    )}
                                </>
                                <div className="max-w-[220px] truncate text-lg font-bold">
                                    {member.nickname}
                                </div>
                                <button
                                    className="rounded bg-customBeige-100 px-2 py-0.5 text-sm text-customBrown-100"
                                    onClick={handleAdd}
                                >
                                    추가
                                </button>
                            </div>
                        ) : (
                            isClicked && (
                                <div className="text-center text-lg">
                                    존재하지 않는 회원입니다.
                                </div>
                            )
                        )}
                        <div className="border-t border-solid border-customLightBlue-100 pt-5 text-right">
                            <button
                                className="rounded border border-customLightBlue-100 px-4 py-2.5 text-customLightBlue-200"
                                onClick={handleCancel}
                            >
                                취소
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        modalContainer,
    );
}
