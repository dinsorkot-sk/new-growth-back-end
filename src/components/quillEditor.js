// 'use client';

// import { useEffect, useRef, useCallback } from 'react';
// import { Prompt } from 'next/font/google';

// const prompt = Prompt({
//   weight: ['400', '500', '600', '700'],
//   subsets: ['thai'],
//   display: 'swap',
// });

// const toolbarOptions = [
//   ['bold', 'italic', 'underline', 'strike'],
//   ['blockquote', 'code-block'],
//   [{ 'header': 1 }, { 'header': 2 }],
//   [{ 'list': 'ordered' }, { 'list': 'bullet' }],
//   [{ 'script': 'sub' }, { 'script': 'super' }],
//   [{ 'indent': '-1' }, { 'indent': '+1' }],
//   [{ 'direction': 'ltr' }, { 'direction': 'rtl' }],
//   [{ 'size': ['small', false, 'large', 'huge'] }],
//   [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//   [{ 'color': [] }, { 'background': [] }],
//   [{ 'font': ['prompt', 'sans-serif', 'serif', 'monospace'] }],
//   [{ 'align': [] }],
//   ['clean'],
//   ['link', 'image', 'video', 'formula']
// ];

// export default function QuillEditor({ value = '', readOnly = false, onChange }) {
//   const editorRef = useRef(null);
//   const quillRef = useRef(null);

//   const initializeQuill = useCallback(async () => {
//     if (typeof window !== 'undefined' && editorRef.current) {
//       const QuillModule = await import('quill');
//       const Quill = QuillModule.default || QuillModule;
//       const Font = Quill.import('formats/font');
//       Font.whitelist = [...Font.whitelist, 'prompt'];
//       Quill.register(Font, true);

//       if (!quillRef.current) {
//         quillRef.current = new Quill(editorRef.current, {
//           theme: 'snow',
//           readOnly: readOnly,
//           modules: {
//             toolbar: toolbarOptions
//           },
//         });

//         quillRef.current.clipboard.dangerouslyPasteHTML(value || '');

//         if (onChange) {
//           quillRef.current.on('text-change', () => {
//             const html = editorRef.current.querySelector('.ql-editor')?.innerHTML;
//             onChange(html);
//           });
//         }
//       } else {
//         quillRef.current.enable(!readOnly);
        
//         const toolbarElement = editorRef.current.parentElement.querySelector('.ql-toolbar');
//         if (toolbarElement) {
//           toolbarElement.style.display = readOnly ? 'none' : 'block';
//         }
//       }
//     }
//   }, [readOnly, value, onChange]);

//   useEffect(() => {
//     initializeQuill();

//     return () => {
//       if (quillRef.current) {
//         quillRef.current = null;
//       }
//     };
//   }, [initializeQuill]);

//   // อัพเดทค่า value เมื่อมีการเปลี่ยนแปลง
//   useEffect(() => {
//     if (quillRef.current && value !== undefined) {
//       const currentContent = quillRef.current.root.innerHTML;
//       if (currentContent !== value) {
//         quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
//       }
//     }
//   }, [value]);

//   return (
//     <>
//       {/* Stylesheet ของ highlight.js */}
//       <link
//         rel="stylesheet"
//         href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css"
//       />
//       <link
//         rel="stylesheet"
//         href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
//       />
//       {/* ปรับสไตล์ให้ Picker และ Editor ใช้ฟอนต์ Prompt */}
//       <style jsx global>{`
//         .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="prompt"]::before {
//           content: "Prompt";
//           font-family: ${prompt.style.fontFamily};
//         }
//         .ql-font-prompt {
//           font-family: ${prompt.style.fontFamily};
//         }
//       `}</style>
//       <div
//         id="editor"
//         ref={editorRef}
//         style={{
//           minHeight: '300px',
//           marginBottom: '50px'
//         }}
//       />
//     </>
//   );
// }




'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Prompt } from 'next/font/google';

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
    
    // ถ้ามี toolbar มากกว่า 1 อัน ให้เก็บอันแรกไว้และลบที่เหลือ
    if (toolbars.length > 1) {
      for (let i = 1; i < toolbars.length; i++) {
        toolbars[i].remove();
      }
    }
  }, []);

  // เอฟเฟ็คหลักสำหรับการสร้าง Quill
  useEffect(() => {
    // หลีกเลี่ยงการทำงานใน SSR
    if (typeof window === 'undefined') return;
    
    // หลีกเลี่ยงการสร้าง Quill ซ้ำถ้ากำลังเริ่มต้นหรือมีอยู่แล้ว
    if (isInitializing || (initialized && quillRef.current)) {
      removeDuplicateToolbars();
      return;
    }
    
    let isMounted = true;
    setIsInitializing(true);
    
    const initQuill = async () => {
      try {
        // สร้าง editor div ถ้ายังไม่มี
        if (!editorRef.current && containerRef.current) {
          editorRef.current = document.createElement('div');
          containerRef.current.innerHTML = ''; // ล้าง container
          containerRef.current.appendChild(editorRef.current);
        }
        
        const QuillModule = await import('quill');
        const Quill = QuillModule.default || QuillModule;
        
        if (!isMounted) return;
        
        // ลงทะเบียนฟอนต์
        const Font = Quill.import('formats/font');
        Font.whitelist = [...Font.whitelist, 'prompt'];
        Quill.register(Font, true);
        
        // กำหนดค่า placeholder เพื่อทำให้มีพื้นที่เริ่มต้น
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
        
        // ปรับ CSS ของ editor หลังจากสร้างเสร็จ
        const editorElement = editorRef.current.querySelector('.ql-editor');
        if (editorElement) {
          editorElement.style.minHeight = '300px';
        }
        
        setInitialized(true);
        setIsInitializing(false);
        
        // ตรวจสอบและลบ toolbar ที่ซ้ำซ้อน
        // setTimeout เพื่อให้แน่ใจว่า DOM ได้อัพเดตเรียบร้อยแล้ว
        setTimeout(removeDuplicateToolbars, 0);
      } catch (error) {
        console.error('Error initializing Quill:', error);
        setIsInitializing(false);
      }
    };
    
    initQuill();
    
    return () => {
      isMounted = false;
    };
  }, [initialized, onChange, readOnly, value, removeDuplicateToolbars, isInitializing]); // เพิ่ม dependencies ที่จำเป็น

  // Update readOnly state when prop changes
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly);
      
      const toolbarElements = containerRef.current?.querySelectorAll('.ql-toolbar');
      toolbarElements?.forEach(toolbar => {
        toolbar.style.display = readOnly ? 'none' : 'block';
      });
    }
  }, [readOnly]);

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && initialized && value !== undefined) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== value) {
        const range = quillRef.current.getSelection();
        quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
        if (range) {
          quillRef.current.setSelection(range);
        }
      }
    }
  }, [value, initialized]);

  // Effect to handle duplicate toolbars
  useEffect(() => {
    if (initialized) {
      removeDuplicateToolbars();
    }
  }, [initialized, removeDuplicateToolbars]);
  
  // เพิ่ม MutationObserver เพื่อตรวจจับการเปลี่ยนแปลงของ DOM
  useEffect(() => {
    if (!containerRef.current || typeof MutationObserver === 'undefined') return;
    
    // สร้าง observer เพื่อตรวจจับการเปลี่ยนแปลงของ DOM
    const observer = new MutationObserver((mutations) => {
      let toolbarAdded = false;
      
      // ตรวจสอบว่ามีการเพิ่ม toolbar หรือไม่
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.classList?.contains('ql-toolbar')) {
              toolbarAdded = true;
            }
          });
        }
      });
      
      // ถ้ามีการเพิ่ม toolbar ให้ตรวจสอบและลบที่ซ้ำซ้อน
      if (toolbarAdded) {
        removeDuplicateToolbars();
      }
    });
    
    // เริ่มตรวจสอบการเปลี่ยนแปลงของ DOM
    observer.observe(containerRef.current, { 
      childList: true,
      subtree: true
    });
    
    // ยกเลิกการตรวจสอบเมื่อ component unmount
    return () => {
      observer.disconnect();
    };
  }, [removeDuplicateToolbars]);

  return (
    <>
      {/* Stylesheet ของ highlight.js และ Quill */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/default.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css"
      />
      {/* ปรับสไตล์ฟอนต์ Prompt และความสูงของ editor */}
      <style jsx global>{`
        .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="prompt"]::before {
          content: "Prompt";
          font-family: ${prompt.style.fontFamily};
        }
        .ql-font-prompt {
          font-family: ${prompt.style.fontFamily};
        }
        /* กำหนดความสูงขั้นต่ำให้กับ editor จริงๆ */
        .ql-editor {
          min-height: 300px !important;
        }
        /* ปรับความสูงของ container เพื่อรองรับ editor */
        .ql-container {
          height: auto !important;
        }
      `}</style>
      <div
        ref={containerRef}
        style={{
          marginBottom: '50px',
          position: 'relative'
        }}
      />
    </>
  );
}