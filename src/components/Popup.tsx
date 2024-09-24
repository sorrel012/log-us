import { createPortal } from 'react-dom';

interface PopupProps {
    show: boolean;
    title: string;
    text?: string;
    onConfirm?: () => void;
    onClose: () => void;
    type?: string;
}

export default function Popup({
    show,
    title,
    text,
    onConfirm,
    onClose,
    type = 'alert',
}: PopupProps) {
    if (!show) return null;

    return createPortal(
        <div className="popup">
            <div className="container">
                <div>
                    <h2>{title}</h2>
                    {text && <p>{text}</p>}
                </div>
                <div className="button">
                    {type === 'confirm' && (
                        <button className="confirm" onClick={onConfirm}>
                            취소
                        </button>
                    )}
                    <button className="close" onClick={onClose}>
                        확인
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('modal'),
    );
}
