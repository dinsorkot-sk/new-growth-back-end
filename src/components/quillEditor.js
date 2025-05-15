'use client';

import { useEffect, useRef } from 'react';

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

  // สร้าง Quill instance หรืออัพเดท readOnly status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // โหลด Quill เท่านั้น ไม่ต้อง destructure สองตัว
      import('quill').then((QuillModule) => {
        // ดึง constructor ของ Quill
        const Quill = QuillModule.default || QuillModule;
        // ลงทะเบียน Prompt font ให้ Quill
        const Font = Quill.import('formats/font');
        Font.whitelist = [...Font.whitelist, 'prompt'];
        Quill.register(Font, true);
        if (editorRef.current) {
          // ถ้ายังไม่มี Quill instance ให้สร้างใหม่
          if (!quillRef.current) {
            // ใช้ constructor ที่เราเพิ่งดึงมา
            quillRef.current = new Quill(editorRef.current, {
              theme: 'snow',
              readOnly: readOnly,
              modules: {
                toolbar: toolbarOptions
              },
            });

            // set initial value
            quillRef.current.clipboard.dangerouslyPasteHTML(value || '');

            // handle onChange
            if (onChange) {
              quillRef.current.on('text-change', () => {
                const html = editorRef.current.querySelector('.ql-editor')?.innerHTML;
                onChange(html);
              });
            }
          } else {
            // อัพเดท readOnly status ถ้ามี instance อยู่แล้ว
            quillRef.current.enable(!readOnly);
            
            // อัพเดทการแสดง toolbar
            const toolbarElement = editorRef.current.parentElement.querySelector('.ql-toolbar');
            if (toolbarElement) {
              toolbarElement.style.display = readOnly ? 'none' : 'block';
            }
          }
        }
      });
    }

    // ไม่ต้อง reset quillRef ในระหว่าง re-render
    // แต่จะ reset เมื่อ component ถูก unmount
    return () => {
      if (quillRef.current && !editorRef.current) {
        quillRef.current = null;
      }
    };
  }, [readOnly]); // เพิ่ม readOnly เข้าไปใน dependencies

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
      {/* โหลด Google Prompt จาก Google Fonts */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700&display=swap"
      />
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
          font-family: 'Prompt', sans-serif;
        }
        .ql-font-prompt {
          font-family: 'Prompt', sans-serif;
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

