import React, { useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { HookCallback } from '@toast-ui/editor/types/editor';

const toolbarItems = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task'],
    ['table', 'image', 'link'],
    ['code', 'codeblock'],
];

export default function TextEditor({
    onChange,
}: {
    onChange: (content: string) => void;
}) {
    const editorRef = useRef<Editor>();

    const handleImageUpload = async (
        image: File | Blob,
        callback: HookCallback,
    ) => {
        const formData = new FormData();
        formData.append('file', image);

        // 사진 서버 전송
        callback('', '');
    };

    const handleChange = () => {
        const content = editorRef.current?.getInstance().getHTML();
        if (content) {
            onChange(content);
        }
    };

    return (
        <Editor
            ref={editorRef}
            height="600px"
            initialValue=" "
            placeholder="내용을 입력하세요"
            initialEditType="wysiwyg"
            hideModeSwitch={true}
            plugins={[colorSyntax]}
            toolbarItems={toolbarItems}
            hooks={{ addImageBlobHook: handleImageUpload }}
            language="ko-KR"
            onChange={handleChange}
        />
    );
}
