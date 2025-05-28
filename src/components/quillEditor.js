'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Prompt } from 'next/font/google';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const prompt = Prompt({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai'],
  display: 'swap',
});

// ไม่ใช้ custom toolbar ที่เป็น separate element 
// แต่จะใช้วิธีการตรวจสอบและลบ toolbar ที่ซ้ำซ้อน
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
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // เอฟเฟ็คสำหรับการทำความสะอาด
  useEffect(() => {
    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
      }
    };
  }, []);

  // ตรวจสอบและลบ toolbar ที่ซ้ำซ้อน
  const removeDuplicateToolbars = useCallback(() => {
    if (!containerRef.current) return;
    
    const toolbars = containerRef.current.querySelectorAll('.ql-toolbar.ql-snow');
    
    if (toolbars.length > 1) {
      for (let i = 1; i < toolbars.length; i++) {
        toolbars[i].remove();
      }
    }
  }, []);

  // เอฟเฟ็คหลักสำหรับการสร้าง Quill
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let isMounted = true;
    
    const initQuill = async () => {
      if (isInitializing || (initialized && quillRef.current)) {
        removeDuplicateToolbars();
        return;
      }

      setIsInitializing(true);
      
      try {
        // สร้าง editor div ถ้ายังไม่มี
        if (!editorRef.current && containerRef.current) {
          editorRef.current = document.createElement('div');
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(editorRef.current);
        }
        
        // กำหนดค่า placeholder
        const options = {
          theme: 'snow',
          readOnly: readOnly,
          modules: {
            toolbar: toolbarOptions
          },
          placeholder: 'พิมพ์ข้อความที่นี่...'
        };
        
        // สร้าง Quill instance
        quillRef.current = new Quill(editorRef.current, options);
        
        // ตั้งค่าเนื้อหาเริ่มต้น
        if (value) {
          quillRef.current.clipboard.dangerouslyPasteHTML(value);
        }
        
        // ตั้งค่า event listener
        quillRef.current.on('text-change', () => {
          if (onChange && editorRef.current) {
            const html = editorRef.current.querySelector('.ql-editor')?.innerHTML;
            onChange(html);
          }
        });
        
        // ปรับ CSS ของ editor
        const editorElement = editorRef.current.querySelector('.ql-editor');
        if (editorElement) {
          editorElement.style.minHeight = '300px';
        }

        setInitialized(true);
      } catch (error) {
        console.error('Error initializing Quill:', error);
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initQuill();

    return () => {
      isMounted = false;
    };
  }, [readOnly, value, onChange, initialized, isInitializing, removeDuplicateToolbars]);

  // เพิ่ม loading state
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
      />
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
        ref={containerRef}
        className="quill-editor-container"
        style={{
          minHeight: '300px',
          marginBottom: '50px'
        }}
      />
    </>
  );
}