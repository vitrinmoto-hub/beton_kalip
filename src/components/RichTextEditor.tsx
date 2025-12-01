'use client';

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    // Image upload handler
    const imageHandler = async () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    // Get the Quill instance from the DOM
                    const quillEditor = document.querySelector('.ql-editor');
                    if (quillEditor) {
                        // Insert image into content
                        const img = `<img src="${data.url}" alt="Uploaded Image" />`;
                        onChange(value + img);
                    }
                } else {
                    alert('Görsel yüklenemedi: ' + (data.error || 'Bilinmeyen hata'));
                }
            } catch (error) {
                console.error('Image upload error:', error);
                alert('Görsel yüklenirken bir hata oluştu');
            }
        };
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image'],
                ['blockquote', 'code-block'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
        clipboard: {
            matchVisual: false
        }
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'list', 'bullet',
        'align',
        'link', 'image',
        'blockquote', 'code-block'
    ];

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder || 'İçerik yazın...'}
            />
            <style jsx global>{`
                .rich-text-editor .ql-container {
                    min-height: 400px;
                    font-size: 16px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                }
                .rich-text-editor .ql-editor {
                    min-height: 400px;
                    color: #1f2937;
                }
                .rich-text-editor .ql-editor.ql-blank::before {
                    color: #9ca3af;
                }
                .rich-text-editor .ql-toolbar {
                    background: #f9fafb;
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;
                }
                .rich-text-editor .ql-container {
                    border-bottom-left-radius: 0.375rem;
                    border-bottom-right-radius: 0.375rem;
                    background: white;
                }
            `}</style>
        </div>
    );
}
