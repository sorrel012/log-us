'use client';

import React, { useEffect, useState } from 'react';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';

import { useBlogStore } from '@/store/useBlogStore';
import { useRouter } from 'next/navigation';
import { customFetch } from '@/utils/customFetch';
import BarChart from '@/components/BarChart';
import AlertPopup from '@/components/AlertPopup';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export interface Statistics {
    today: number;
    yesterday: number;
    total: number;
    blogVisitors: BlogVisitor[];
}

export interface BlogVisitor {
    date: string;
    visitCount: number;
}

export default function PostsManagePage() {
    const router = useRouter();
    const { blogId } = useBlogStore();

    const [visitors, setVisitors] = useState<BlogVisitor[]>([]);
    const [todayCnt, setTodayCnt] = useState(0);
    const [yesterdayCnt, setYesterdayCnt] = useState(0);
    const [totalCnt, setTotalCnt] = useState(0);

    const [showPopup, setShowPopup] = useState(false);
    const [popupTitle, setPopupTitle] = useState('');
    const [popupText, setPopupText] = useState('');

    useEffect(() => {
        if (blogId) {
            (async () => {
                const res = await customFetch<Statistics>('/blog/statistics', {
                    queryKey: ['statistics', blogId],
                    params: { blogId },
                });

                if (res.isError) {
                    setPopupTitle('통계 조회에 실패하였습니다.');
                    setPopupText('잠시 후 다시 시도해 주세요.');
                    setShowPopup(true);
                    return;
                }

                setVisitors(res.data?.blogVisitors || []);
                setTodayCnt(res.data?.today || 0);
                setYesterdayCnt(res.data?.yesterday || 0);
                setTotalCnt(res.data?.total || 0);
            })();
        }
    }, [blogId]);

    const chartData = {
        labels: visitors.map((visitor) => visitor.date.substring(5)),
        datasets: [
            {
                data: visitors.map((visitor) => visitor.visitCount),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                ticks: {
                    display: false,
                },
                grid: {
                    drawTicks: false,
                    drawBorder: false,
                },
            },
            x: {
                autoSkip: false,
                stepSize: 1,
                grid: {
                    drawBorder: true,
                },
            },
        },
    };

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">통계</legend>
            <div className="flex items-baseline gap-2">
                <h3 className="text-md font-bold">방문 수 통계</h3>
                <div className="flex gap-3 rounded bg-customBeige-100 px-3 py-0.5 text-sm font-bold">
                    <div>
                        <span className="mr-1">오늘</span>
                        <span>{todayCnt}</span>
                    </div>
                    <div>
                        <span className="mr-1">어제</span>
                        <span>{yesterdayCnt}</span>
                    </div>
                    <div>
                        <span className="mr-1">누적</span>
                        <span>{totalCnt}</span>
                    </div>
                </div>
            </div>
            <section className="mt-10">
                <BarChart chartData={chartData} chartOptions={chartOptions} />
            </section>

            <AlertPopup
                show={showPopup}
                title={popupTitle}
                text={popupText}
                onConfirm={() => {
                    setShowPopup(false);
                }}
            />
        </fieldset>
    );
}
