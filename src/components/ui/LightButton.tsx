interface LightButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
}

export default function LightButton({
    text,
    onClick,
    className,
}: LightButtonProps) {
    return (
        <button
            className={`rounded-md border border-solid border-customLightBlue-100 px-2 py-1 ${className}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}
