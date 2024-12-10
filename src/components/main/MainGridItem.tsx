import { IoMdEye } from "react-icons/io";
import { GoComment } from "react-icons/go";
import { FaHeart } from "react-icons/fa";

interface MainGridItemProps {
    title : string;
    content : string;
    view : number;
    comment : number;
    like : number;
}

const MainGridItem : React.FC<MainGridItemProps> = ({ title, content, view, comment, like }) => {
    return (
        <div className='border border-solid border-gray-200 rounded-md font-default shadow bg-white'>
            <div className='p-5 flex'>
                <img src="/logus_default_image.png" className='w-5/12' alt='이미지' />
                <div className='flex flex-col ml-5 w-7/12 justify-between'>
                    <div>
                        <div className='text-xl font-semibold mb-2'>{title}</div>
                        <div className='text-sm text-gray-600 leading-snug'>{content}</div>
                    </div>
                    <div className='flex items-center gap-4 text-gray-600 mt-3'>
                        <div className='flex gap-2 items-center text-sm'>
                            <IoMdEye />
                            <div>{view}</div>
                        </div>
                        <div className='flex gap-2 items-center text-sm'>
                            <GoComment />
                            <div>{comment}</div>
                        </div>
                        <div className='flex gap-2 items-center text-sm'>
                            <FaHeart />
                            <div>{like}</div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default MainGridItem;