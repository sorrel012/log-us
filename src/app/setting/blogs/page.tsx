'use client';

import React, { useEffect, useState } from 'react';
import AlertPopup from '@/components/AlertPopup';
import BlogGrid from '@/components/blog/setting/BlogGrid';
import { customFetch } from '@/utils/customFetch';
import { Blog } from '@/components/UserGrid';

export default function BlogsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        (async () => {
            const res = await customFetch<Blog[]>('/blog/our-log', {
                queryKey: ['blogs'],
            });

            if (res.isError) {
                setPopupTitle('블로그 목록을 불러오지 못했습니다.');
                setPopupText('잠시 후 다시 시도해 주세요.');
                setShowPopup(true);
                return;
            }

            const blogsData: Blog[] = Array.isArray(res.data) ? res.data : [];
            setBlogs(blogsData.filter((blog: Blog) => blog.shareYn === 'Y'));
        })();
    }, []);

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">블로그 목록</legend>
            {!isLoading &&
                (blogs && blogs.length >= 1 ? (
                    <div className="min-h-[40vh]">
                        <BlogGrid blogs={blogs} />
                    </div>
                ) : (
                    <div>블로그 목록이 존재하지 않습니다.</div>
                ))}
            <AlertPopup
                show={showPopup}
                onConfirm={() => setShowPopup(false)}
                title={popupTitle}
                text={popupText}
            />
        </fieldset>
    );
}
