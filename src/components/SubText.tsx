import SubLineBar from '@/components/SubLineBar';

interface SubTextProps {
    text: string;
    isLast?: boolean;
}

export default function SubText({ text, isLast = false }: SubTextProps) {
    return (
        <div className="flex">
            <span className="max-w-[500px] truncate">{text}</span>
            {!isLast && <SubLineBar />}
        </div>
    );
}
