import Join from '@/components/join/Join';

export default function JoinPage() {
    return (
        <div className="font-default mb-20 h-[100vh] overflow-y-scroll pb-10">
            <div className="p-6 text-center text-2xl font-semibold tracking-wider">
                회원가입
            </div>
            <div className="mx-auto mb-20 h-auto w-7/12 rounded-lg border border-solid border-customLightBlue-100 px-10 py-10">
                <Join />
            </div>
        </div>
    );
}
