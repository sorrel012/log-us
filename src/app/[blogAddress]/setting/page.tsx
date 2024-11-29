'use client';

import MemberInfoForm from '@/components/blog/setting/MemberInfoForm';
import MemberPwdForm from '@/components/blog/setting/MemberPwdForm';
import MemberWithdrawalForm from '@/components/blog/setting/MemberWithdrawalForm';

export default function SettingMain() {
    return (
        <fieldset>
            <legend className="mb-8 text-lg font-bold">회원정보 변경</legend>
            <MemberInfoForm />
            <MemberPwdForm />
            <MemberWithdrawalForm />
        </fieldset>
    );
}
