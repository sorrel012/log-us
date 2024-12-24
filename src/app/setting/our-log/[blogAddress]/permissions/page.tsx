'use client';

import React, { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';
import BlogPermission from '@/components/blog/setting/BlogPermission';
import { customFetch } from '@/utils/customFetch';
import { Member } from '@/components/sidebar/UserProfile';
import AlertPopup from '@/components/AlertPopup';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function PermissionManagePage() {
    const router = useRouter();
    const { blogId, userBlogAuth } = useBlogStore();
    const { loginUser } = useAuthStore();
    const { blogAddress } = useParams();

    const [members, setMembers] = useState<Member[]>([]);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');
    const [popupId, setPopupId] = useState('CLOSE');

    useEffect(() => {
        if (userBlogAuth === 'EDITOR') {
            router.push('/setting');
        } else {
            if (blogId) {
                (async () => {
                    const res = await customFetch<Member[]>('/blog/auth', {
                        queryKey: ['blog-auth', blogId],
                        params: { blogId },
                    });

                    if (res.isError) {
                        setPopupTitle('블로그 권한 조회에 실패했습니다.');
                        setPopupText('잠시 후 다시 시도해 주세요.');
                        setPopupId('CLOSE');
                        setShowPopup(true);
                    }

                    if (res.data) {
                        const index = res.data.findIndex(
                            (member) => member.memberId === loginUser,
                        );

                        if (res.data[index].blogAuth === 'EDITOR') {
                            setPopupTitle('접근할 수 없는 메뉴입니다.');
                            setPopupText('');
                            setPopupId('MOVE');
                            setShowPopup(true);
                        }
                    }

                    setMembers(res.data!);
                })();
            }
        }
    }, [blogId, loginUser, router, userBlogAuth]);

    const handleConfirm = () => {
        setShowPopup(false);
        if (popupId === 'MOVE') {
            router.push(`/setting/our-log/${blogAddress}/posts`);
        } else if (popupId === 'REFRESH') {
            router.refresh();
        }
    };

    const handlePermission = (memberId: number, auth: string) => {
        const index = members.findIndex(
            (member) => member.memberId === memberId,
        );
        const orgMember = members[index];
        orgMember.blogAuth = auth;

        setMembers((prevState) => [
            ...prevState.slice(0, index),
            orgMember,
            ...prevState.slice(index + 1),
        ]);
    };

    const handleSave = async () => {
        const res = await customFetch(`/blog/auth?blogId=${blogId}`, {
            queryKey: ['blog-auth', JSON.stringify(members), blogId],
            method: 'PUT',
            body: members
                .filter((member) => member.blogAuth !== 'OWNER')
                .map((member) => ({
                    memberId: member.memberId,
                    blogAuth: member.blogAuth,
                })),
        });

        if (res.isError) {
            setPopupTitle('블로그 권한을 수정하지 못했습니다.');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setPopupId('CLOSE');
            setShowPopup(true);
            return;
        }

        setPopupTitle('블로그 권한을 수정했습니다.');
        setPopupText('');
        setPopupId('REFRESH');
        setShowPopup(true);
    };

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">블로그 권한 관리</legend>
            <section className="rounded border border-solid border-customLightBlue-100 px-2 py-3.5">
                {members &&
                    members.map((member) => (
                        <BlogPermission
                            key={member.memberId}
                            member={member}
                            onChangePermission={handlePermission}
                        />
                    ))}
            </section>
            <div className="mt-8 text-right">
                <button
                    className="rounded bg-customBeige-100 px-4 py-2 text-md text-customBrown-100"
                    onClick={handleSave}
                >
                    저장
                </button>
            </div>
            <AlertPopup
                show={showPopup}
                title={popupTitle}
                text={popupText}
                onConfirm={handleConfirm}
            />
        </fieldset>
    );
}
