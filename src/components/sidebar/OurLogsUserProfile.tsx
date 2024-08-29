import { AiOutlineUser } from 'react-icons/ai';

const members = [
    { name: 'hana', image: 'https://' },
    { name: 'manda', image: 'https://' },
    { name: 'loveorlike', image: 'https://' },
    { name: '코코', image: 'https://' },
    { name: 'asdfasdfasdfasdfasdfasfsda', image: 'https://' },
];

export default function OurLogsUserProfile() {
    return (
        <ul className="mb-2">
            {members.map((member, index) => (
                <li key={index} className="mb-1 flex">
                    <AiOutlineUser className="mr-2 size-7 rounded-full bg-fuchsia-100 p-1" />
                    <span className="truncate text-lg">{member.name}</span>
                </li>
            ))}
        </ul>
    );
}
