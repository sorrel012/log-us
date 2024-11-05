'use client';

import React, { useRef, useState } from 'react';
import { GrFormPreviousLink } from 'react-icons/gr';
import { usePathname, useRouter } from 'next/navigation';
import { customFetch } from '@/utils/customFetch';
import { useBlogStore } from '@/store/useBlogStore';
import SelectBox from '@/components/SelectBox';
import TextEditor from '@/components/blog/TextEditor';
import Popup from '@/components/Popup';
import { UseSeries } from '@/hooks/useSeries';
import { isObjEqual } from '@/utils/commonUtil';
import SavePostPopup from '@/components/blog/post/SavePostPopup';

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

type popupIdType =
    | 'TMP_SAVE_EXIT'
    | 'CLOSE'
    | 'EXIT'
    | 'SAVE'
    | 'CONTENT_FOCUS'
    | 'TITLE_FOCUS'
    | '';

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

    const getData = (type: string, postInfo?: any) => {
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
            formData.append('thumbImg', postInfo?.thumbImg);
            requestDto = {
                blogId,
                title,
                content,
                status: postInfo?.status,
                ...(seriesId > 0 && { seriesId }),
                ...(postInfo?.parentId > 0 && { parentId: postInfo?.parentId }),
                ...(postInfo?.categoryId > 0 && {
                    categoryId: postInfo?.categoryId,
                }),
                tags: postInfo?.tags,
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
            const data = getData('TEMPORARY');
            await customFetch('/posts', {
                queryKey: ['tmpPost'],
                method: 'POST',
                body: data,
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
                .catch(() => {
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
        } else if (popupId === 'TITLE_FOCUS') {
            const tmpRef = titleRef.current!;
            tmpRef.focus();
            handleClosePopup();
        } else if (popupId === 'CONTENT_FOCUS') {
            handleClosePopup();
            setIsContentEmpty(true);
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
                    const data = getData('TEMPORARY');
                    await customFetch('/posts', {
                        queryKey: ['tmpPost'],
                        method: 'POST',
                        body: data,
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

    const [showSavePopup, setShowSavePopup] = useState(false);
    const titleRef = useRef<HTMLInputElement | null>(null);

    const [isContentEmpty, setIsContentEmpty] = useState(false);

    const handlePublish = () => {
        if (!title.trim()) {
            setPopupId('TITLE_FOCUS');
            setPopupTitle('제목을 입력해 주세요.');
            setShowPopup(true);

            return;
        }

        if (!content.trim || content === '<p><br></p>') {
            setPopupId('CONTENT_FOCUS');
            setPopupTitle('내용을 입력해 주세요.');
            setShowPopup(true);

            return;
        }

        if (title.length > 100) {
            setPopupId('TITLE_FOCUS');
            setPopupTitle('제목을 100자 이내로 작성해 주세요.');
            setShowPopup(true);

            return;
        }

        if (content.length > 100) {
            setPopupId('CONTENT_FOCUS');
            setPopupTitle('내용을 10,000자 이내로 작성해 주세요.');
            setShowPopup(true);

            return;
        }

        setShowSavePopup(true);
    };

    const handleSavePost = async (post) => {
        const data = getData(post.status, post);
        await customFetch('/posts', {
            queryKey: ['savePost', post.status],
            method: 'POST',
            body: data,
        })
            .then(() => {
                handleClosePopup();
                setTimeout(() => {
                    setPopupId('EXIT');
                    setPopupTitle('글이 발행되었습니다.');
                    setPopupType('alert');
                    setShowPopup(true);
                }, 300);
            })
            .catch(() => {
                openErrorPopup();
            });
    };

    return (
        <section className="h-screen overflow-y-auto">
            <div className="mx-auto max-w-screen-xl px-24 py-10">
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
                    ref={titleRef}
                />
                <TextEditor
                    onChange={setContent}
                    contents={content}
                    isEmpty={isContentEmpty}
                />
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
                            onClick={handlePublish}
                        >
                            발행
                        </button>
                    </div>
                </div>
            </div>
            <Popup
                show={showPopup}
                title={popupTitle}
                text={popupMessage}
                type={popupType}
                onConfirm={handleConfirm}
                onCancel={handleClosePopup}
            />

            <SavePostPopup
                show={showSavePopup}
                onClose={() => setShowSavePopup(false)}
                message="게시글이 발행되었습니다."
                onPostSave={handleSavePost}
            />
        </section>
    );
}
