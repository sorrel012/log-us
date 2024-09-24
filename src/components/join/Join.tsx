export default function Join() {
    return (
        <div className="font-default bg-customBegie-200/80">
            <div className="p-8 text-2xl font-semibold tracking-wider text-center">이메일 회원가입</div>

            <div className="bg-customBegie-100 w-5/12 mx-auto my-0 rounded-lg px-10 py-10">
                {/* 내 정보 입력 */}
                <div className="text-lg font-semibold border-b-2 border-solid border-gray-200 pb-2">내 정보 입력</div>
                <div className="p-5">
                    <div className="flex items-center mb-5">
                        <div className="font-semibold w-2/12">아이디<span className="ml-1 text-red-400">*</span></div>
                        <div className="w-full flex">
                            <input type="text" className="w-10/12 h-8 rounded-sm pl-2 ml-4 outline-none" placeholder="영어 소문자, 숫자, 특수기호(-), (_)로 5~20자 이내"/>
                            <button className="w-3/12 bg-gray-400 rounded-e-sm">중복 확인</button>
                        </div>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="font-semibold w-2/12">닉네임<span className="ml-1 text-red-400">*</span></div>
                        <input type="text" className="w-10/12 h-8 rounded-sm pl-2 outline-none"/>
                    </div>
                    <div className="flex items-center mb-8">
                        <div className="font-semibold w-2/12">프로필 사진</div>
                        <div className="flex items-center">
                            <img src="/google_login_round.png" width={100} alt="기본 이미지"/>
                            <div className="ml-8">
                                <div className="mb-3">
                                    <button className="border border-solid border-gray-300 px-10 py-3">등록</button>
                                    <button className="border border-solid border-l-0 border-gray-300 px-10 py-3">삭제</button>
                                </div>
                                <div>이미지를 선택하지 않으면 기본 이미지로 대체합니다.</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="font-semibold w-2/12">비밀번호<span className="ml-1 text-red-400">*</span></div>
                        <input type="password" className="w-10/12 h-8 rounded-sm pl-2 outline-none" placeholder="영문 대/소문자, 숫자, 특수문자 중 2가지 혼합하여 8~16자 이내"/>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="font-semibold w-2/12">비밀번호 확인<span className="ml-1 text-red-400">*</span></div>
                        <input type="password" className="w-10/12 h-8 rounded-sm pl-2 outline-none" placeholder="영문 대/소문자, 숫자, 특수문자 중 2가지 혼합하여 8~16자 이내"/>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="font-semibold w-2/12">이메일<span className="ml-1 text-red-400">*</span></div>
                        <div className="w-full flex">
                            <input type="text" className="w-6/12 h-8 rounded-sm pl-2 ml-4 outline-none" />
                            <button className="w-2/12 bg-gray-200 rounded-sm ml-3">인증 코드 발송</button>
                        </div>
                    </div>
                    <div className="flex items-center mb-5">
                        <div className="font-semibold w-2/12">인증 코드 입력<span className="ml-1 text-red-400">*</span></div>
                        <div className="w-full flex">
                            <input type="text" className="w-6/12 h-8 rounded-sm pl-2 ml-4 outline-none" />
                            <button className="w-2/12 bg-gray-200 rounded-sm ml-3">확인</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
