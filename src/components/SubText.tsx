import SubLineBar from '@/components/SubLineBar';

interface SubTextProps {
    text: string;
    isLast?: boolean;
}

export default function SubText({ text, isLast = false }: SubTextProps) {
    return (
        <div className="flex">
            {text}
            {!isLast && <SubLineBar />}
        </div>
    );
}
