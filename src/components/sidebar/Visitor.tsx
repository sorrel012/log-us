import { MdOutlinePerson } from 'react-icons/md';

const visitors = [
    'Jay',
    '하이',
    '닉네임',
    'ㅁㅁㅁㅁㅁㅁㅁasdfasdfasdfasddfasdfasdfasdfasdf',
];

export default function Visitor() {
    return (
        <section className="font-default mt-4 px-2">
            <div className="mb-3 font-bold">오늘 다녀갔어요</div>
            <ul className="shadow-custom rounded-md p-2 text-sm leading-5">
                {visitors.map((visitor, index) => (
                    <li key={index} className="flex items-center">
                        <span>
                            <MdOutlinePerson className="size-4" />
                        </span>
                        <span className="truncate">{visitor}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
