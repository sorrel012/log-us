'use client';

import { useEffect, useState } from 'react';
import { customFetch } from '@/utils/customFetch';

export default function Home() {
    const [hi, setHi] = useState(false);

    useEffect(() => {
        const data = {
            member: 'hana',
            cnt: 34,
        };

        if (hi) {
            // customFetch('/test?seq=1')
            //     .then((response) => console.log('response: ', r))
            //     .catch((error) => {
            //         console.log('error:, ', error);
            //     });
            customFetch('/test', 'POST', data)
                .then((response) => console.log('response: ', response))
                .catch((error) => {
                    console.log('error:, ', error);
                });
        }
    }, [hi]);

    return (
        <button onClick={() => setHi((prev) => !prev)}>프로젝트 세팅</button>
    );
}
