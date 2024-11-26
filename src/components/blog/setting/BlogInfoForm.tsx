'use client';

import { useEffect, useState } from 'react';
import { FcCancel, FcOk } from 'react-icons/fc';
import { customFetch } from '@/utils/customFetch';

export default function BlogInfoForm({
    blogInfo,
    onSave,
    isLoading,
}: {
    blogInfo: any;
    onSave: (data: any) => void;
    isLoading: boolean;
}) {
    const [blogName, setBlogName] = useState('');
    const [blogAddress, setBlogAddress] = useState('');
    const [introduce, setIntroduce] = useState('');
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [isDuplicatedCheckedClicked, setIsDuplicatedCheckedClicked] =
        useState(false);
    const [blogAddressMessage, setBlogAddressMessage] = useState(
        '사용할 수 없는 블로그 주소입니다.',
    );

    useEffect(() => {
        if (blogInfo) {
            setBlogName(blogInfo.blogName);
            setBlogAddress(blogInfo.blogAddress);
            setIntroduce(blogInfo.introduce!);
        }
    }, [blogInfo]);

    const handleBlogAddressChange = (e) => {
        setIsDuplicateChecked(false);
        setBlogAddress(e.target.value);
    };

    const validateBlogAddress = (address: string) => {
        const regex = /^[a-zA-Z0-9-]+$/;
        return (
            address.length >= 4 &&
            address.length <= 32 &&
            regex.test(address) &&
            !address.startsWith('-') &&
            !address.endsWith('-') &&
            !address.includes('--')
        );
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
        } else {
            setIsDuplicateChecked(true);
            setBlogAddressMessage('사용할 수 있는 주소입니다.');
        }
    };

    return (
        <filedset>
            <legend className="mb-8 text-lg font-bold">블로그 정보 변경</legend>
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
                        onClick={() =>
                            onSave({
                                blogName,
                                blogAddress,
                                introduce,
                                isDuplicateChecked,
                            })
                        }
                    >
                        저장
                    </button>
                </div>
            </div>
        </filedset>
    );
}
