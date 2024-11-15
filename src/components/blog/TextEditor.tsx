import React, { useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

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
        if (contents && !editorRef.current?.getInstance().getHTML()) {
            editorRef.current?.getInstance().setHTML(contents);
        }
    }, [contents]);

    useEffect(() => {
        if (isEmpty) {
            editorRef.current?.getInstance().focus();
        }
    }, [isEmpty]);

    const handleChange = () => {
        const content = editorRef.current?.getInstance().getHTML();
        if (content) {
            onChange(content);
        }
    };

    return (
        <Editor
            ref={editorRef}
            height="80vh"
            initialValue=""
            placeholder="내용을 입력하세요"
            initialEditType="wysiwyg"
            hideModeSwitch={true}
            plugins={[colorSyntax]}
            toolbarItems={toolbarItems}
            language="ko-KR"
            onChange={handleChange}
        />
    );
}
