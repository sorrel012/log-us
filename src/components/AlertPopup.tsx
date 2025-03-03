import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

export interface PopupProps {
    show: boolean;
    title?: string;
    text?: string;
    onConfirm: () => void;
    onCancel?: () => void;
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

export default function AlertPopup({
    show,
    title,
    text,
    onConfirm,
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
                            {title && (
                                <h2
                                    className="leading-7"
                                    dangerouslySetInnerHTML={{
                                        __html: title,
                                    }}
                                />
                            )}
                            {text && (
                                <p
                                    className="leading-5"
                                    dangerouslySetInnerHTML={{
                                        __html: text,
                                    }}
                                />
                            )}
                        </div>
                        <div className="button">
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
