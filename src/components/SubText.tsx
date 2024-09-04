import SubLineBar from '@/components/SubLineBar';

export default function SubText({ text }: { text: string }) {
    return (
        <div className="flex">
            {text}
            <SubLineBar />
        </div>
    );
}
