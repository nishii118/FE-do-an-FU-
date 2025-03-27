import React, { useEffect, useState } from "react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import CustomUploadAdapter from "./CustomUploadAdapter";

const editorConfiguration = {
  toolbar: {
    items: [
      "heading",
      "|",
      "fontFamily",
      "fontSize",
      "fontColor",
      "fontBackgroundColor",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "alignment",
      "outdent",
      "indent",
      "|",
      "imageInsert",
      "blockQuote",
      "insertTable",
      "mediaEmbed",
      "pageBreak",
      "selectAll",
      "underline",
      "removeFormat",
      "findAndReplace",
      "undo",
      "redo",
    ],
  },
  language: "en",
  image: {
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
      "linkImage",
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
      "tableProperties",
    ],
  },
  extraPlugins: [CustomUploadAdapterPlugin],
};

function CustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    const uploadedImages = editor.config.get("uploadedImages");
    return new CustomUploadAdapter(loader, uploadedImages);
  };
}

const CustomEditor = ({ editorData, setEditorData }) => {
  const [uploadedImages] = useState([]);

  useEffect(() => {
    editorConfiguration.uploadedImages = uploadedImages;
  }, [uploadedImages]);

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  return (
    <div className="Editor h-auto">
      <CKEditor
        editor={Editor}
        config={editorConfiguration}
        data={editorData}
        onReady={(editor) => {
          console.log("Editor is ready to use!", editor);
        }}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default CustomEditor;