import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, className }) => {
  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}],
      ['bold', 'italic', 'underline'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className={`rich-text-editor-container ${className || ''}`}>
      <ReactQuill 
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style>{`
        .rich-text-editor-container .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          background-color: #fafafa;
          min-height: 15rem;
          font-family: inherit;
        }
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          background-color: #ffffff;
          border-color: #f4f4f5;
        }
        .rich-text-editor-container .ql-container.ql-snow {
          border-color: #f4f4f5;
        }
        .rich-text-editor-container .ql-editor {
          font-size: 0.875rem;
          line-height: 1.5;
        }
        .rich-text-editor-container .ql-editor.ql-blank::before {
          font-style: italic;
          color: #a1a1aa;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
