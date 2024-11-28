'use client';

import { useState } from 'react';

export default function PostsManagePage() {
    const [totalPosts, setTotalPosts] = useState(0);

    return (
        <fieldset>
            <div>
                <legend className="mb-8 text-lg font-bold">글 관리</legend>
                <span
                    className="relative ml-0.5 text-sm text-customLightBlue-200"
                    style={{ top: '-0.1em' }}
                >
                    {totalPosts}
                </span>
            </div>
            {/*<ContentsSettingList contents={} buttons={} onChange={} />*/}
        </fieldset>
    );
}
