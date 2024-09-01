export default function BlogHeader() {
    return (
        <header className='shadow-md p-2'>
            <div className="flex justify-between items-center">
                <div className='flex items-center'>
                    <img src="/logo_icon.png" className='ml-3' width={40} alt="Logo"/>
                    <p className="text-2xl"> 나무의 하루 </p>
                </div>
                
                <div>
                    <button className="text-xl text-white tracking-wide bg-customDarkBlue-200 px-6 py-1 rounded-lg mr-4 hover:bg-customDarkBlue-100 transition-colors duration-300">
                        로그인
                    </button>
                </div>
            </div>
        </header>
    );
}
