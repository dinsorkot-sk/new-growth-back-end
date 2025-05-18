'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Prompt } from 'next/font/google';

const prompt = Prompt({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai'],
  display: 'swap',
});

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'direction': 'ltr' }, { 'direction': 'rtl' }],
  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': ['prompt', 'sans-serif', 'serif', 'monospace'] }],
  [{ 'align': [] }],
  ['clean'],
  ['link', 'image', 'video', 'formula']
];

export default function QuillEditor({ value = '', readOnly = false, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const initializeQuill = useCallback(async () => {
    if (typeof window !== 'undefined' && editorRef.current) {
      const QuillModule = await import('quill');
      const Quill = QuillModule.default || QuillModule;
      const Font = Quill.import('formats/font');
      Font.whitelist = [...Font.whitelist, 'prompt'];
      Quill.register(Font, true);

      if (!quillRef.current) {
        quillRef.current = new Quill(editorRef.current, {
          theme: 'snow',
          readOnly: readOnly,
          modules: {
            toolbar: toolbarOptions
          },
        });

        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');

        if (onChange) {
          quillRef.current.on('text-change', () => {
            const html = editorRef.current.querySelector('.ql-editor')?.innerHTML;
            onChange(html);
          });
        }
      } else {
        quillRef.current.enable(!readOnly);
        
        const toolbarElement = editorRef.current.parentElement.querySelector('.ql-toolbar');
        if (toolbarElement) {
          toolbarElement.style.display = readOnly ? 'none' : 'block';
        }
      }
    }
  }, [readOnly, value, onChange]);

  useEffect(() => {
    initializeQuill();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, [initializeQuill]);

  // อัพเดทค่า value เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
      }
    }
  }, [value]);

  return (
    <>
      {/* Stylesheet ของ highlight.js */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
      />
      {/* ปรับสไตล์ให้ Picker และ Editor ใช้ฟอนต์ Prompt */}
      <style jsx global>{`
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="prompt"]::before {
          content: "Prompt";
          font-family: ${prompt.style.fontFamily};
        }
        .ql-font-prompt {
          font-family: ${prompt.style.fontFamily};
        }
      `}</style>
      <div
        id="editor"
        ref={editorRef}
        style={{
          minHeight: '300px',
          marginBottom: '50px'
        }}
      />
    </>
  );
}

