import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface PopupProps {
    show: boolean;
    title?: string;
    text?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    type?: 'alert' | 'confirm';
}

const popupVariants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.15,
            ease: 'easeOut',
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.15,
            ease: 'easeOut',
        },
    },
};

export default function Popup({
    show,
    title,
    text,
    onConfirm,
    onCancel,
    type = 'alert',
}: PopupProps) {
    const [isClient, setIsClient] = useState(false);
    const [modalContainer, setModalContainer] = useState<HTMLElement | null>(
        null,
    );

    useEffect(() => {
        setIsClient(true);
        setModalContainer(document.getElementById('modal'));
    }, []);

    if (!isClient || !modalContainer) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {show && (
                <motion.div
                    key="container"
                    className="popup"
                    exit="exit"
                    variants={popupVariants}
                >
                    <motion.div
                        key="popup"
                        className="container"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={popupVariants}
                    >
                        <div>
                            <h2>{title}</h2>
                            {text && <p>{text}</p>}
                        </div>
                        <div className="button">
                            {type === 'confirm' && (
                                <button className="confirm" onClick={onCancel}>
                                    취소
                                </button>
                            )}
                            <button className="close" onClick={onConfirm}>
                                확인
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        modalContainer,
    );
}
