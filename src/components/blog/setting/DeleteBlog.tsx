'use client';

import { useState } from 'react';

export default function DeleteBlog({ onDelete }: { onDelete: () => void }) {
    const [wantDelete, setWantDelete] = useState<boolean>(false);

    return (
        <filedset className="select-none">
            <legend className="mb-4 text-lg font-bold">블로그 삭제</legend>
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
                    className={`rounded px-4 py-2 text-md ${wantDelete ? 'border border-customBrown-100 text-customBrown-100' : 'border border-neutral-300 bg-neutral-300 text-neutral-700'}`}
                    disabled={!wantDelete}
                    onClick={onDelete}
                >
                    삭제
                </button>
            </div>
        </filedset>
    );
}
