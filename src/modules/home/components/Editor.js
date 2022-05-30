/*
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useCallback, useState } from 'react';

function MyEditor(){
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
      );
    
    const handleKeyCommand = useCallback((command, editorState)=>{
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          setEditorState(newState);
          return 'handled';
        }
    
        return 'not-handled';
    },[])

    const _onBoldClick = useCallback( () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    },[editorState])

    const onItalicClick = () => {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'))
         }


    console.log(editorState.getCurrentContent())
    return (
        <div>
            <button onClick={onItalicClick}>
                <em>I</em>
            </button>
            <Editor
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                placeholder="Enter some text..."
            />
        </div>
    );
}
export default MyEditor;
*/
import { Editor } from "react-draft-wysiwyg"
import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useCallback, useEffect, useState } from "react";



function MyEditor( {setText} ){
    const [editorState, setEditorState] = useState(null);


    const updateTextDescription = useCallback( state => {
        setEditorState(state);
        const data = convertToRaw(editorState.getCurrentContent());
        setText(EditorState.createWithContent(convertFromRaw(data)))
    },[editorState, setText])

    useEffect(() => {
        EditorState.createEmpty();
    },[])
    

    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={updateTextDescription}
            />
            {/*<Editor
                toolbarHidden
                editorState={editorState2}
            />*/}
        </div>
    );
}
export default MyEditor;