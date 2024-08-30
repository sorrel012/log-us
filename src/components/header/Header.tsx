import Link from 'next/link';

export default function Header() {
    return (
        <header className='flex items-center'>
            <img src="/logo.png" width={320}></img>
            <div>
                <Link href='notice' className='m-5 text-2xl'>공지사항</Link>
                <Link href='qna' className='m-5 text-2xl'>QnA</Link>
            </div>

        </header>
    );
}
