'use client';

import React, { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { useRouter } from 'next/navigation';
import DeleteBlog from '@/components/blog/setting/DeleteBlog';
import OurLogInfoForm from '@/components/blog/setting/OurLogInfoForm';
import { Member } from '@/components/sidebar/UserProfile';
import emailjs from 'emailjs-com';

export default function OurLogSetting() {
    const router = useRouter();
    const { blogId, blogInfo } = useBlogStore();
    // TODO zustand
    const loginUser = 1;
    const loginUserNickname = 'hana';

    const [isLoading, setIsLoading] = useState(true);
    const [blogName, setBlogName] = useState('');
    const [blogAddress, setBlogAddress] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [newBlogAddress, setNewBlogAddress] = useState('');
    const [members, setMembers] = useState<Member[]>([]);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('CLOSE');

    useEffect(() => {
        setIsLoading(true);
        if (blogInfo) {
            setBlogName(blogInfo.blogName);
            setBlogAddress(blogInfo.blogAddress);
            setIntroduce(blogInfo.introduce!);
            setMembers(blogInfo.members!);
        }
        setIsLoading(false);
    }, [blogInfo]);

    const handleConfirm = () => {
        if (popupId === 'CLOSE') {
            setShowPopup(false);
        } else {
            setShowPopup(false);
            router.refresh();
        }
    };

    const validateBlogName = (name: string): boolean => {
        if (name.length < 2 || name.length > 20) {
            setPopupTitle('블로그 이름을 다시 입력해 주세요.');
            setPopupText(
                '블로그 이름은 최소 2자, 최대 20자까지 입력할 수 있습니다.',
            );
            setPopupId('CLOSE');
            setShowPopup(true);
            return false;
        }

        const regex = /^[a-zA-Z0-9가-힣-_ ]+$/;
        if (!regex.test(name)) {
            setPopupTitle('블로그 이름을 다시 입력해 주세요.');
            setPopupText(
                '블로그 이름은 한글, 영문, 숫자, 특수문자(-, _)만 사용 가능합니다.',
            );
            setPopupId('CLOSE');
            setShowPopup(true);
            return false;
        }

        return true;
    };

    const handleSaveBlogInfo = async (updatedInfo) => {
        const areArraysOfObjectsEqual = (arr1, arr2) => {
            if (arr1.length !== arr2.length) return false;
            return arr1.every((obj1, index) => {
                const obj2 = arr2[index];
                return Object.keys(obj1).every(
                    (key) => obj1[key] === obj2[key],
                );
            });
        };

        const isSameData =
            updatedInfo.blogName === blogName &&
            updatedInfo.blogAddress === blogAddress &&
            updatedInfo.introduce === introduce &&
            areArraysOfObjectsEqual(updatedInfo.members, members);

        if (isSameData) {
            setPopupTitle('변경사항이 없습니다.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return false;
        }

        if (!validateBlogName(updatedInfo.blogName)) {
            return;
        }

        if (
            updatedInfo.blogAddress !== blogAddress &&
            !updatedInfo.isDuplicateChecked
        ) {
            setPopupTitle('블로그 주소 중복확인을 해주세요.');
            setPopupText('');
            setPopupId('CLOSE');
            setShowPopup(true);
            return false;
        }

        if (updatedInfo.introduce.length > 100) {
            setPopupTitle('블로그 소개를 다시 입력해 주세요.');
            setPopupText('블로그 소개는 최대 100자까지 입력할 수 있습니다.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return false;
        }

        const body = {
            blogName: updatedInfo.blogName,
            blogAddress: updatedInfo.blogAddress,
            introduce: updatedInfo.introduce,
            shareYn: blogInfo.shareYn,
            members: [
                ...updatedInfo.members.map((member) => ({
                    memberId: member.memberId,
                })),
                { memberId: loginUser },
            ],
        };

        const res = await customFetch(`/blog/setting?blogId=${blogId}`, {
            queryKey: [
                'edit-blog-info',
                updatedInfo.blogAddress,
                updatedInfo.blogName,
                updatedInfo.introduce,
                JSON.stringify(members),
            ],
            method: 'PUT',
            body,
        });

        if (res.isError) {
            setPopupTitle('블로그 정보를 변경하지 못했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        const newMembers = updatedInfo?.members.filter((newMember: Member) => {
            const index = members.findIndex(
                (orgMember) => orgMember.memberId === newMember.memberId,
            );
            if (index < 0) {
                return newMember;
            }
        });

        try {
            for (const newMember of newMembers) {
                if (newMember.memberId !== loginUser) {
                    await emailjs.send(
                        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
                        process.env.NEXT_PUBLIC_EMAIL_INVITATION_TEMPLATE_ID,
                        {
                            to_email: newMember.email,
                            to_name: newMember.nickname,
                            from_name: loginUserNickname,
                            blog_name: blogName,
                            message:
                                updatedInfo.invitation &&
                                updatedInfo.invitation.trim().length > 0
                                    ? updatedInfo.invitation
                                    : '이 공간에 특별한 추억을 남겨보세요.',
                            link: `https://logus.com/${blogAddress}`, //TODO 블로그 도메인 수정
                        },
                        process.env.NEXT_PUBLIC_EMAIL_USER_ID,
                    );
                }
            }

            router.push(`/${blogAddress}`);
        } catch (error) {
            setPopupTitle('초대장 발송에 실패했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
            return;
        }

        setNewBlogAddress(updatedInfo.blogAddress);
        setPopupTitle('블로그 정보를 변경했습니다.');
        setPopupText('');
        setPopupId('REFRESH');
        setShowPopup(true);
    };

    const handleDeleteBlog = async () => {
        const res = await customFetch(`/blog/setting?blogId=${blogId}`, {
            queryKey: ['delete-blog', blogAddress, blogName, introduce],
            method: 'DELETE',
        });

        if (res.isError) {
            setPopupTitle(res.error || '블로그를 삭제하지 못했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        router.push('/main');
    };

    return (
        <section>
            <OurLogInfoForm
                blogInfo={blogInfo}
                onSave={(updatedInfo) => handleSaveBlogInfo(updatedInfo)}
                isLoading={isLoading}
            />
            <DeleteBlog
                onDelete={handleDeleteBlog}
                shareYn={blogInfo?.shareYn!}
            />
            <AlertPopup
                show={showPopup}
                onConfirm={handleConfirm}
                title={popupTitle}
                text={popupText}
            />
        </section>
    );
}
