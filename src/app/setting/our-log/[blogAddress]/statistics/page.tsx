'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
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
import { customFetch } from '@/utils/customFetch';
import BarChart from '@/components/BarChart';
import AlertPopup from '@/components/AlertPopup';
import { Member } from '@/components/sidebar/UserProfile';
import PersonIcon from '@/components/icons/PersonIcon';

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

interface MemberWriteStatistics {
    date: string;
    count: number;
}

interface MemberStatistics {
    memberInfo: Partial<Member>;
    today: number;
    total: number;
    dateCount: MemberWriteStatistics[];
}

const colorPalette = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
];

const borderPalette = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
];
export default function OurLogStatisticsPage() {
    const { blogId } = useBlogStore();

    const [visitors, setVisitors] = useState<BlogVisitor[]>([]);
    const [todayCnt, setTodayCnt] = useState(0);
    const [yesterdayCnt, setYesterdayCnt] = useState(0);
    const [totalCnt, setTotalCnt] = useState(0);

    const [postStatistics, setPostStatistics] = useState<MemberStatistics[]>(
        [],
    );
    const [commentStatistics, setCommentStatistics] = useState<
        MemberStatistics[]
    >([]);

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
                const postRes = await customFetch<MemberStatistics[]>(
                    '/blog/statistics/member',
                    {
                        queryKey: ['statistics', 'post', blogId],
                        params: { blogId, type: 'post' },
                    },
                );
                const commentRes = await customFetch<MemberStatistics[]>(
                    '/blog/statistics/member',
                    {
                        queryKey: ['statistics', 'comment', blogId],
                        params: { blogId, type: 'comment' },
                    },
                );

                if (res.isError || postRes.isError || commentRes.isError) {
                    setPopupTitle('통계 조회에 실패하였습니다.');
                    setPopupText('잠시 후 다시 시도해 주세요.');
                    setShowPopup(true);
                    return;
                }

                setVisitors(res.data?.blogVisitors || []);
                setTodayCnt(res.data?.today || 0);
                setYesterdayCnt(res.data?.yesterday || 0);
                setTotalCnt(res.data?.total || 0);

                setPostStatistics(
                    Array.isArray(postRes.data)
                        ? postRes.data.map((post) => ({
                              memberInfo: post.memberInfo,
                              today: post.today,
                              total: post.total,
                              dateCount: post.dateCount,
                          }))
                        : [],
                );

                setCommentStatistics(
                    Array.isArray(commentRes.data)
                        ? commentRes.data.map((comment) => ({
                              memberInfo: comment.memberInfo,
                              today: comment.today,
                              total: comment.total,
                              dateCount: comment.dateCount,
                          }))
                        : [],
                );
            })();
        }
    }, [blogId]);

    const visitorChartData = {
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

    const postChartData = {
        labels:
            postStatistics[0]?.dateCount.map((item) =>
                item.date.substring(5),
            ) || [],
        datasets: postStatistics.map((post, index) => ({
            label: post.memberInfo.nickname || 'Unknown',
            data: post.dateCount.map((item) => item.count),
            backgroundColor: colorPalette[index % colorPalette.length],
            borderColor: borderPalette[index % borderPalette.length],
            borderWidth: 1,
        })),
    };

    const commentChartData = {
        labels:
            commentStatistics[0]?.dateCount.map((item) =>
                item.date.substring(5),
            ) || [],
        datasets: commentStatistics.map((comment, index) => ({
            label: comment.memberInfo.nickname || 'Unknown',
            data: comment.dateCount.map((item) => item.count),
            backgroundColor: colorPalette[index % colorPalette.length],
            borderColor: borderPalette[index % borderPalette.length],
            borderWidth: 1,
        })),
    };

    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">통계</legend>
            <article>
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
                <section className="mt-2 w-[75vw]">
                    <BarChart
                        chartData={visitorChartData}
                        chartOptions={chartOptions}
                    />
                </section>
            </article>

            <article>
                <div className="mt-10 flex items-baseline gap-1">
                    <h3 className="text-md font-bold">멤버별 작성한 글 수</h3>
                    <span className="text-xs font-bold">(오늘/누적)</span>
                </div>

                <ul className="mt-2 flex min-h-[120px] w-[75vw] flex-wrap justify-between gap-6 rounded-lg bg-customBeige-100 px-8 py-4">
                    {postStatistics &&
                        postStatistics.map((post) => (
                            <li
                                key={post.memberInfo.memberId}
                                className="flex w-[300px] items-center gap-2"
                            >
                                {post.memberInfo && (
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center gap-2 text-lg font-bold">
                                            {post.memberInfo.imgUrl ? (
                                                <div className="relative size-10">
                                                    <Image
                                                        src={
                                                            post.memberInfo
                                                                .imgUrl
                                                        }
                                                        width={80}
                                                        height={80}
                                                        alt="프로필사진"
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            ) : (
                                                <PersonIcon size="size-10 " />
                                            )}
                                            <div>
                                                {post.memberInfo.nickname}
                                            </div>
                                        </div>
                                        <div className="font-bold">
                                            {`${post.today}/${post.total}`}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>
                <section className="mt-2 w-[75vw]">
                    <BarChart
                        chartData={postChartData}
                        chartOptions={chartOptions}
                    />
                </section>
            </article>

            <article className="mb-10">
                <div className="mt-10 flex items-baseline gap-1">
                    <h3 className="text-md font-bold">멤버별 작성한 댓글 수</h3>
                    <span className="text-xs font-bold">(오늘/누적)</span>
                </div>
                <ul className="mt-2 flex min-h-[120px] w-[75vw] flex-wrap justify-between gap-6 rounded-lg bg-customBeige-100 px-8 py-4">
                    {commentStatistics &&
                        commentStatistics.map((comment) => (
                            <li
                                key={comment.memberInfo.memberId}
                                className="flex w-[300px] items-center gap-2"
                            >
                                {comment.memberInfo && (
                                    <div className="flex w-full items-center justify-between">
                                        <div className="flex items-center gap-2 text-lg font-bold">
                                            {comment.memberInfo.imgUrl ? (
                                                <div className="relative size-10">
                                                    <Image
                                                        src={
                                                            comment.memberInfo
                                                                .imgUrl
                                                        }
                                                        width={80}
                                                        height={80}
                                                        alt="프로필사진"
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            ) : (
                                                <PersonIcon size="size-10 " />
                                            )}
                                            <div>
                                                {comment.memberInfo.nickname}
                                            </div>
                                        </div>
                                        <div className="font-bold">
                                            {`${comment.today}/${comment.total}`}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                </ul>
                <section className="mt-2 w-[75vw]">
                    <BarChart
                        chartData={commentChartData}
                        chartOptions={chartOptions}
                    />
                </section>
            </article>

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