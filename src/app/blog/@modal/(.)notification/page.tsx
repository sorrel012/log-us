'use client';

import { useRouter } from 'next/navigation';

export default function NotificationModalPage() {
    const router = useRouter();
    const onCloseClick = () => {
        router.back();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="h-[60vh] w-[40vw] max-w-screen-lg rounded-lg bg-white shadow-lg lg:h-[65vh] lg:w-[50vw]">
                {/*/!* Modal Header *!/*/}
                {/*<div className="flex justify-between border-b border-gray-300 p-4">*/}
                {/*    <h2 className="text-lg font-semibold">구독</h2>*/}
                {/*    <button onClick={onCloseClick}>*/}
                {/*        <IoCloseOutline*/}
                {/*            size={24}*/}
                {/*            className="text-gray-500 hover:text-black"*/}
                {/*        />*/}
                {/*    </button>*/}
                {/*</div>*/}

                {/*/!* Modal Body *!/*/}
                {/*<div className="p-6">/!* 여기에 내용이 들어갑니다 *!/</div>*/}

                {/*/!* Modal Footer *!/*/}
                {/*<div className="flex justify-end border-t border-gray-300 p-4">*/}
                {/*    <button*/}
                {/*        onClick={onCloseClick}*/}
                {/*        className="rounded-md bg-gray-500 px-4 py-2 text-white"*/}
                {/*    >*/}
                {/*        닫기*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}
