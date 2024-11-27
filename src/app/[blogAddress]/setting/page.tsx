'use client';

import MemberInfoForm from '@/components/blog/setting/MemberInfoForm';
import MemberPwdForm from '@/components/blog/setting/MemberPwdForm';

export default function SettingMain() {
    return (
        <filedset>
            <legend className="mb-8 text-lg font-bold">회원정보 변경</legend>
            <MemberInfoForm />
            <MemberPwdForm />
        </filedset>
    );
}
