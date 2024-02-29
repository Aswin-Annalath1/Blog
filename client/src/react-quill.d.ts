declare module 'react-quill' {
    import React from 'react';
  
    interface ReactQuillProps {
      value?: string;
      onChange?: (content: string, delta: any, source: string, editor: any) => void;
      theme?: string; // Include the theme prop
      modules?: Record<string, any>; // Include the modules prop
      // Add other props based on your usage
    }
  
    const ReactQuill: React.FC<ReactQuillProps>;
    export default ReactQuill;
  }