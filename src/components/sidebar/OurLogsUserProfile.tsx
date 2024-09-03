import PersonIcon from '@/components/icons/PersonIcon';

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
                <li key={index} className="mb-1 flex items-center">
                    <div>
                        <PersonIcon className="mr-2 mt-1" size="size-7" />
                    </div>
                    <span className="truncate text-lg">{member.name}</span>
                </li>
            ))}
        </ul>
    );
}
