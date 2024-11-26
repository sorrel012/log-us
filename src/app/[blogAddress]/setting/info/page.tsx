'use client';

import { useEffect, useState } from 'react';
import { useBlogStore } from '@/store/useBlogStore';
import { customFetch } from '@/utils/customFetch';
import AlertPopup from '@/components/AlertPopup';
import { FcCancel, FcOk } from 'react-icons/fc';
import { useRouter } from 'next/navigation';

export default function BlogInfo() {
    const router = useRouter();
    const { blogId, blogInfo } = useBlogStore();

    const [isLoading, setIsLoading] = useState(true);
    const [blogName, setBlogName] = useState('');
    const [blogAddress, setBlogAddress] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [isDuplicatedCheckedClicked, setIsDuplicatedCheckedClicked] =
        useState(false);
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    const [blogAddressMessage, setBlogAddressMessage] = useState(
        '사용할 수 없는 블로그 주소입니다.',
    );
    const [wantDelete, setWantDelete] = useState<boolean>(false);

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
        setShowPopup(false);
    };

    const handleBlogAddressChange = (e) => {
        setIsDuplicateChecked(false);
        setBlogAddress(e.target.value);
    };

    const validateBlogAddress = (address: string) => {
        if (address.length < 4 || address.length > 32) {
            setPopupTitle('블로그 주소를 다시 입력해 주세요.');
            setPopupText(
                '블로그 주소는 4자 이상, 32자 이하로 입력해야 합니다.',
            );
            setShowPopup(true);
            return false;
        }

        const regex = /^[a-zA-Z0-9-]+$/;
        if (!regex.test(address)) {
            setPopupTitle('블로그 주소를 다시 입력해 주세요.');
            setPopupText(
                '블로그 주소는 영문, 숫자, 하이픈(-)만 사용 가능합니다.',
            );
            setShowPopup(true);
            return false;
        }

        if (address.startsWith('-') || address.endsWith('-')) {
            setPopupTitle('블로그 주소를 다시 입력해 주세요.');
            setPopupText(
                '블로그 주소는 하이픈(-)으로 시작하거나<br>끝날 수 없습니다.',
            );
            setShowPopup(true);
            return false;
        }

        if (address.includes('--')) {
            setPopupTitle('블로그 주소를 다시 입력해 주세요.');
            setPopupText(
                '블로그 주소에는 연속된 하이픈(-)을 사용할 수 없습니다.',
            );
            setShowPopup(true);
            return false;
        }

        return true;
    };

    const handleDuplicateCheck = async () => {
        setIsDuplicatedCheckedClicked(true);
        if (!validateBlogAddress(blogAddress)) {
            setIsDuplicateChecked(false);
            setBlogAddressMessage('사용할 수 없는 주소입니다.');
            return;
        }

        const res = await customFetch('/blog/address-dupl', {
            queryKey: ['address-dupl', blogAddress],
            params: { blogAddress },
        });

        if (res.code === 3005) {
            setIsDuplicateChecked(false);
            setBlogAddressMessage('사용할 수 없는 주소입니다.');
            return;
        } else {
            setIsDuplicateChecked(true);
            setBlogAddressMessage('사용할 수 있는 주소입니다.');
            return;
        }
    };

    const validateBlogName = (name: string): boolean => {
        if (name.length < 2 || name.length > 20) {
            setPopupTitle('블로그 이름을 다시 입력해 주세요.');
            setPopupText(
                '블로그 이름은 최소 2자, 최대 20자까지 입력할 수 있습니다.',
            );
            setShowPopup(true);
            return false;
        }

        const regex = /^[a-zA-Z0-9가-힣-_ ]+$/;
        if (!regex.test(name)) {
            setPopupTitle('블로그 이름을 다시 입력해 주세요.');
            setPopupText(
                '블로그 이름은 한글, 영문, 숫자, 특수문자(-, _)만 사용 가능합니다.',
            );
            setShowPopup(true);
            return false;
        }

        return true;
    };

    const handleSaveBlogInfo = async () => {
        const isSameData =
            blogName === blogInfo.blogName &&
            blogAddress === blogInfo.blogAddress &&
            introduce === blogInfo.introduce;

        if (isSameData) {
            setPopupTitle('변경사항이 없습니다.');
            setShowPopup(true);
            return false;
        }

        if (!validateBlogName(blogName)) {
            return;
        }

        if (!isDuplicateChecked) {
            setPopupTitle('블로그 주소 중복확인을 해주세요.');
            setShowPopup(true);
            return false;
        }

        if (introduce.length > 100) {
            setPopupTitle('블로그 소개를 다시 입력해 주세요.');
            setPopupText('블로그 소개는 최대 100자까지 입력할 수 있습니다.');
            setShowPopup(true);
            return false;
        }

        const body = {
            blogId,
            blogName,
            blogAddress,
            introduce,
            shareYn: blogInfo.shareYn,
        };

        const res = await customFetch(`/blog/setting?blogId=${blogId}`, {
            queryKey: ['edit-blog-info', blogAddress, blogName, introduce],
            method: 'PUT',
            body,
        });

        if (res.isError) {
            setPopupTitle('블로그 정보를 수정하지 못했습니다');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
        }
    };

    const handleDeleteBlog = async () => {
        const res = await customFetch(`/blog/setting?blogId=${blogId}`, {
            queryKey: ['delete-blog', blogAddress, blogName, introduce],
            method: 'DELETE',
        });

        if (res.isError) {
            setPopupTitle('블로그를 삭제하지 못했습니다');
            setPopupText('잠시 후 다시 시도해 주세요.');
            setShowPopup(true);
        }

        //TODO 기본 블로그 삭제 처리

        router.push('/setting');
    };

    return (
        <section>
            <h2 className="mb-8 text-lg font-bold">블로그 정보 변경</h2>
            <div className="*:mb-10">
                <div>
                    <label htmlFor="blogName" className="font-semibold">
                        블로그명
                    </label>
                    <input
                        type="text"
                        id="blogName"
                        className="mt-4 w-full rounded border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                        value={blogName}
                        onChange={(e) => setBlogName(e.target.value)}
                        placeholder="한글, 영문, 숫자, 특수문자(-,_)를 사용하여 입력해주세요.(최소 2자, 최대 20자)"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="blogAddress" className="font-semibold">
                        블로그 주소
                    </label>
                    <div className="mt-4 flex">
                        <input
                            type="text"
                            id="blogAddress"
                            className="flex-1 rounded-l border border-solid border-customLightBlue-100 px-2 py-1 text-sm outline-none"
                            placeholder="한글, 영문, 숫자, 하이픈(-)을 사용하여 입력해주세요.(최소 4자, 최대 32자)"
                            value={blogAddress}
                            onChange={handleBlogAddressChange}
                            disabled={isLoading}
                        />
                        <button
                            className={`rounded-r border-b border-r border-t px-2 py-1.5 ${isDuplicateChecked ? 'border-customLightBlue-200 bg-customLightBlue-200 text-white' : 'border-customLightBlue-100 text-customDarkBlue-200'}`}
                            onClick={handleDuplicateCheck}
                            disabled={isDuplicateChecked || isLoading}
                        >
                            중복 확인
                        </button>
                    </div>
                    <div
                        className={`${
                            isDuplicateChecked
                                ? 'text-green-500'
                                : 'text-red-600'
                        } mt-1 flex gap-1`}
                    >
                        {isDuplicatedCheckedClicked && (
                            <>
                                {isDuplicateChecked ? <FcOk /> : <FcCancel />}
                                <span>{blogAddressMessage}</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="introduce" className="block font-semibold">
                        블로그 소개
                    </label>
                    <textarea
                        id="introduce"
                        className="mt-4 w-full resize-none rounded border border-solid border-customLightBlue-100 p-2 text-sm leading-6 outline-none"
                        rows={8}
                        value={introduce}
                        onChange={(e) => setIntroduce(e.target.value)}
                        placeholder="100자 이내로 입력해 주세요."
                        disabled={isLoading}
                    />
                </div>
                <div className="-mt-2 text-right">
                    <button
                        className={`rounded px-4 py-2 text-md ${isDuplicateChecked ? 'bg-customBeige-100 text-customBrown-100' : 'bg-neutral-300 text-neutral-700'}`}
                        disabled={!isDuplicateChecked}
                        onClick={handleSaveBlogInfo}
                    >
                        저장
                    </button>
                </div>
            </div>
            <div>
                <h2 className="mb-4 text-lg font-bold">블로그 삭제</h2>
                <div className="text-sm leading-6">
                    <p>블로그를 삭제할 경우 블로그의 모든 내용이 삭제됩니다.</p>
                    <p>삭제된 블로그는 다시 복구할 수 없습니다.</p>
                    <p>동의할 경우 삭제 버튼을 눌러 블로그를 삭제해 주세요</p>
                </div>
                <div className="mt-2 flex items-center text-sm text-customLightBlue-200">
                    <input
                        type="checkbox"
                        checked={wantDelete || false}
                        onChange={(e) => setWantDelete(e.target.checked)}
                        className="-ml-2 scale-50"
                        id="deleteBlog"
                    />
                    <label htmlFor="deleteBlog" className="ml-1 cursor-pointer">
                        유의사항을 모두 확인하였으며, 삭제를 희망합니다.
                    </label>
                </div>
                <div className="-mt-2 text-right">
                    <button
                        className={`rounded px-4 py-2 text-md ${wantDelete ? 'border border-customBrown-100 text-customBrown-100' : 'bg-neutral-300 text-neutral-700'}`}
                        disabled={!wantDelete}
                        onClick={handleDeleteBlog}
                    >
                        삭제
                    </button>
                </div>
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
