'use client';

import React, { FormEventHandler, useState } from 'react';
import { GrFormPreviousLink } from 'react-icons/gr';
import { usePathname, useRouter } from 'next/navigation';
import { customFetch } from '@/utils/customFetch';
import { useBlogStore } from '@/store/useBlogStore';
import SelectBox from '@/components/SelectBox';
import TextEditor from '@/components/blog/TextEditor';
import Popup from '@/components/Popup';
import { UseSeries } from '@/hooks/useSeries';
import { isObjEqual } from '@/utils/commonUtil';

type PostStatus = 'PUBLIC' | 'SECRET' | 'TEMPORARY';

interface PostPayload {
    blogId: number;
    categoryId?: number;
    seriesId?: number | null;
    title: string;
    content: string;
    status: PostStatus;
    tags?: string[];
}

type popupIdType = 'TMP_SAVE_EXIT' | 'CLOSE' | 'EXIT' | 'SAVE' | '';

export default function NewPostPage() {
    const router = useRouter();
    const pathname = usePathname();
    const blogAddress = pathname.split('/')[1];
    const { blogId } = useBlogStore();
    const { data } = UseSeries();
    const series = data
        ? [
              {
                  imgUrl: '',
                  seriesOrder: 0,
                  seriesName: '시리즈',
                  seriesId: 0,
              },
              ...data,
          ]
        : [];
    const selectedSeries = series.map((item) => ({
        text: item.seriesName,
        value: item.seriesId,
    }));

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [seriesId, setSeriesId] = useState<number>(null);

    const handleItemsPerValueChange = (value: number) => {
        setSeriesId(value);
    };

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        // 저장 후 처리
        //서버에 데이터 전송
    };

    const savePost = (type: string) => {
        const formData = new FormData();
        let requestDto;

        if (type === 'TEMPORARY') {
            requestDto = {
                blogId,
                title,
                content,
                status: 'TEMPORARY',
                ...(seriesId > 0 && { seriesId }),
            };
        } else {
            // TODO 게시글 등록
            requestDto = {
                blogId,
                title,
                content,
                status: 'TEMPORARY',
                ...(seriesId > 0 && { seriesId }),
            };
        }

        formData.append('requestDto', JSON.stringify(requestDto));

        return formData;
    };

    const openErrorPopup = () => {
        handleClosePopup();
        setTimeout(() => {
            setPopupId('CLOSE');
            setPopupMessage('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
        }, 300);
    };

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupTitle, setPopupTitle] = useState('');
    const [popupId, setPopupId] = useState<popupIdType>('');
    const [popupType, setPopupType] = useState<'alert' | 'confirm'>();
    const handleBackClick = () => {
        if (content.trim().length > 0 || title.trim().length > 0 || seriesId) {
            setPopupTitle('작성 중인 글을 저장하시겠습니까?');
            setPopupMessage('저장하지 않은 글은 복구할 수 없습니다.');
            setShowPopup(true);
            setPopupType('confirm');
            setPopupId('EXIT');
        } else {
            router.push(`/${blogAddress}`);
        }
    };
    const handleClosePopup = () => {
        setShowPopup(false);
        setPopupTitle('');
        setPopupMessage('');
        setPopupType(null);
        setPopupId('');
    };
    const handleConfirm = async () => {
        if (popupId === 'EXIT') {
            const data = savePost('TEMPORARY');
            await customFetch('/posts', {
                queryKey: ['tmpPost'],
                method: 'POST',
                data,
            })
                .then(() => {
                    handleClosePopup();
                    setTimeout(() => {
                        setPopupId('TMP_SAVE_EXIT');
                        setPopupTitle('작성 중인 글이 저장되었습니다.');
                        setPopupType('alert');
                        setShowPopup(true);
                    }, 300);
                })
                .catch((error) => {
                    openErrorPopup();
                });
        } else if (popupId === 'TMP_SAVE_EXIT') {
            handleClosePopup();
            router.push(`/${blogAddress}/posts/series/0&전체보기`);
        } else if (popupId === 'SAVE') {
            handleClosePopup();
            router.push(`/${blogAddress}/posts/series/0&전체보기`);
        } else if (popupId === 'CLOSE') {
            handleClosePopup();
        }
    };

    const handleTmpPost = async () => {
        try {
            const response = await customFetch<PostPayload>(
                '/posts-blogId.json',
                {
                    queryKey: ['tmpPost'],
                    params: { blogId },
                },
            );

            if (!response || !response.data) {
                throw new Error('임시 저장에 실패했습니다.');
            }

            const tmpPost = response.data;
            const tmpPostExists = !!tmpPost.status;
            const hasChange =
                title.trim() ||
                (content.trim() && content !== '<p><br></p>') ||
                seriesId;

            if (hasChange) {
                if (tmpPostExists) {
                    const newTmpPost = { seriesId, title, content };
                    if (
                        !isObjEqual(newTmpPost, {
                            seriesId: tmpPost.seriesId,
                            title: tmpPost.title,
                            content: tmpPost.content,
                        })
                    ) {
                        setPopupTitle('이미 저장된 게시글이 있습니다.');
                        setPopupMessage('저장하시겠습니까?');
                        setPopupType('confirm');
                        setShowPopup(true);
                        setPopupId('EXIT');
                    } else {
                        setPopupTitle('변경 사항이 없습니다.');
                        setShowPopup(true);
                        setPopupId('CLOSE');
                    }
                } else {
                    const data = savePost('TEMPORARY');
                    await customFetch('/posts', {
                        queryKey: ['tmpPost'],
                        method: 'POST',
                        data,
                    });
                    setPopupId('CLOSE');
                    setPopupTitle('작성 중인 글이 임시 저장되었습니다.');
                    setShowPopup(true);
                }
            } else if (tmpPostExists) {
                setTitle(tmpPost.title);
                setContent(tmpPost.content);
                setSeriesId(tmpPost.seriesId || 0);
                setPopupId('CLOSE');
                setPopupTitle('임시 저장된 글을 불러왔습니다.');
                setShowPopup(true);
            } else {
                setPopupId('CLOSE');
                setPopupTitle('임시 저장된 글이 없습니다.');
                setShowPopup(true);
            }
        } catch (error) {
            openErrorPopup();
        }
    };

    return (
        <div className="h-screen overflow-y-auto">
            <form
                className="mx-auto max-w-screen-xl px-24 py-10"
                onSubmit={handleSubmit}
            >
                {selectedSeries.length > 0 && (
                    <SelectBox
                        onItemsPerValueChange={handleItemsPerValueChange}
                        items={selectedSeries}
                        defaultValue={seriesId || selectedSeries[0]?.value}
                    />
                )}
                <input
                    type="text"
                    className="mb-5 w-full border-b border-solid border-customLightBlue-100 pb-2 pt-4 text-2xl outline-none"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextEditor onChange={setContent} contents={content} />
                <div className="mt-5 flex justify-between">
                    <div
                        className="flex cursor-pointer items-center text-customLightBlue-200"
                        onClick={handleBackClick}
                    >
                        <GrFormPreviousLink />
                        <button type="button">나가기</button>
                    </div>
                    <div className="*:cursor-pointer *:rounded-md *:py-1.5">
                        <button
                            type="button"
                            className="mr-2 border border-customLightBlue-200 px-1 text-customLightBlue-200"
                            onClick={handleTmpPost}
                        >
                            임시저장
                        </button>
                        <button
                            type="submit"
                            className="border border-customLightBlue-200 bg-customLightBlue-200 px-4 text-white"
                        >
                            발행
                        </button>
                    </div>
                </div>
            </form>
            <Popup
                show={showPopup}
                title={popupTitle}
                text={popupMessage}
                type={popupType}
                onConfirm={handleConfirm}
                onCancel={handleClosePopup}
            />
        </div>
    );
}
