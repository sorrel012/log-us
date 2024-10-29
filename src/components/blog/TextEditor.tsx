import React, { useEffect, useRef, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { HookCallback } from '@toast-ui/editor/types/editor';
import Popup from '@/components/Popup';
import { customFetch } from '@/utils/customFetch';

const toolbarItems = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task'],
    ['table', 'image', 'link'],
    ['code', 'codeblock'],
];

export default function TextEditor({
    onChange,
    contents,
    isEmpty,
}: {
    onChange: (content: string) => void;
    contents: string;
    isEmpty: boolean;
}) {
    const editorRef = useRef<Editor>();

    useEffect(() => {
        editorRef.current?.getInstance().setHTML(contents || '');
    }, [contents]);

    useEffect(() => {
        editorRef.current?.getInstance().focus();
    }, [isEmpty]);

    const handleImageUpload = async (
        image: File | Blob,
        callback: HookCallback,
    ) => {
        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await customFetch('/temporary-image', {
                method: 'POST',
                data: formData,
                queryKey: ['imageUpload'],
            });

            const imageUrl = response.data?.filepath;
            const imageName = response.data?.orgFilename;

            if (imageUrl) {
                callback(imageUrl, imageName);
            }
        } catch (error) {
            setShowPopup(true);
        }
    };

    const [showPopup, setShowPopup] = useState(false);

    const handleConfirm = () => {
        setShowPopup(false);
    };

    const handleChange = () => {
        const content = editorRef.current?.getInstance().getHTML();
        if (content) {
            onChange(content);
        }
    };

    return (
        <>
            <Editor
                ref={editorRef}
                height="600px"
                initialValue={contents}
                placeholder="내용을 입력하세요"
                initialEditType="wysiwyg"
                hideModeSwitch={true}
                plugins={[colorSyntax]}
                toolbarItems={toolbarItems}
                hooks={{ addImageBlobHook: handleImageUpload }}
                language="ko-KR"
                onChange={handleChange}
            />
            <Popup
                show={showPopup}
                text="이미지 업로드에 실패했습니다. 다시 시도해주세요."
                type="alert"
                onConfirm={handleConfirm}
            />
        </>
    );
}
