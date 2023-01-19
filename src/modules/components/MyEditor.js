import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useCallback, useEffect, useState } from "react";



function MyEditor( { setText, readOnly, rawText } ){
    const [editorState, setEditorState] = useState(null);


    const updateTextDescription = useCallback( state => {
        setEditorState(state);
        setText(convertToRaw(editorState.getCurrentContent()));
    },[editorState, setText])

    useEffect(() => {
        EditorState.createEmpty();
        if( rawText ){
            setEditorState(EditorState.createWithContent(convertFromRaw( JSON.parse( rawText ) )))
        }
    },[rawText, readOnly])

    return (
        <div>
            { readOnly
              ? <Editor
                    toolbarHidden
                    editorState={editorState}
                />
              : <Editor
                    editorState={editorState}
                    onEditorStateChange={updateTextDescription}
                />
            }
        </div>
    );
}

export default MyEditor;