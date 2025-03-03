import React, { useEffect, useRef } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { Editor } from '@toast-ui/react-editor';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { HookCallback } from '@toast-ui/editor/types/editor';
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
        if (editorRef.current) {
            if (editorRef.current instanceof Editor) {
                const editorInstance = editorRef.current.getInstance();

                if (contents && editorInstance.getHTML() !== contents) {
                    editorInstance.setHTML(contents);
                }
            }
        }
    }, [contents]);

    useEffect(() => {
        if (isEmpty) {
            editorRef.current?.getInstance().focus();
        }
    }, [isEmpty]);

    const handleImageUpload = async (
        image: File | Blob,
        callback: HookCallback,
    ) => {
        const formData = new FormData();
        formData.append('file', image);

        try {
            const res = await customFetch('/temporary-image', {
                queryKey: ['temporary-image'],
                method: 'POST',
                body: formData,
            });

            const imageUrl = res.data?.filepath;
            const imageName = res.data?.orgFilename;

            if (imageUrl) {
                callback(imageUrl, imageName);
            }
        } catch (error) {
            console.log('error');
        }
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
            height="80vh"
            initialValue=""
            placeholder="내용을 입력하세요"
            initialEditType="wysiwyg"
            hideModeSwitch={true}
            plugins={[colorSyntax]}
            toolbarItems={toolbarItems}
            language="ko-KR"
            onChange={handleChange}
            hooks={{ addImageBlobHook: handleImageUpload }}
        />
    );
}