'use client';

import { useEffect, useRef } from 'react';

export default function QuillEditor() {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    // We need to dynamically import Quill since it's a client-side only library
    if (typeof window !== 'undefined') {
      // Only run on client-side
      import('quill').then((Quill) => {
        // Check if the editor already exists to prevent re-initialization
        if (editorRef.current && !quillRef.current) {
          quillRef.current = new Quill.default(editorRef.current, {
            theme: 'snow',
            modules: {
              toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],
                ['link', 'image']
              ]
            },
          });
          
          // Set initial content
          quillRef.current.clipboard.dangerouslyPasteHTML(
            '<p>Hello World!</p><p>Some initial <strong>bold</strong> text</p><p><br /></p>'
          );
        }
      });
    }
    
    // Cleanup function
    return () => {
      quillRef.current = null;
    };
  }, []);

  return (
    <>
      {/* Load Quill CSS from CDN */}
      <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" 
      />
      
      {/* Editor container */}
      <div 
        id="editor" 
        ref={editorRef} 
        style={{ 
          height: '300px',
          marginBottom: '50px'
        }}
      />
    </>
  );
}