'use client';

import { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { useRouter } from 'next/navigation';
import DeleteBlog from '@/components/blog/setting/DeleteBlog';
import BlogInfoForm from '@/components/blog/setting/BlogInfoForm';

export default function BlogInfo() {
    const router = useRouter();
    const { blogId, blogInfo } = useBlogStore();

    const [isLoading, setIsLoading] = useState(true);
    const [blogName, setBlogName] = useState('');
    const [blogAddress, setBlogAddress] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [newBlogAddress, setNewBlogAddress] = useState('');

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
        }
        setIsLoading(false);
    }, [blogInfo]);

    const handleConfirm = () => {
        if (popupId === 'CLOSE') {
            setShowPopup(false);
        } else {
            setShowPopup(false);
            router.push(`/${newBlogAddress}/setting/info`);
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
        const isSameData =
            updatedInfo.blogName === blogName &&
            updatedInfo.blogAddress === blogAddress &&
            updatedInfo.introduce === introduce;

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
        };

        const res = await customFetch(`/blog/setting?blogId=${blogId}`, {
            queryKey: [
                'edit-blog-info',
                updatedInfo.blogAddress,
                updatedInfo.blogName,
                updatedInfo.introduce,
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

        setNewBlogAddress(updatedInfo.blogAddress);
        setPopupTitle('블로그 정보를 변경했습니다.');
        setPopupText('');
        setPopupId('MOVE');
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

        router.push(`/${blogAddress}/setting`);
    };

    return (
        <section>
            <BlogInfoForm
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
