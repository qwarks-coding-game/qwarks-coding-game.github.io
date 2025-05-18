import { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({
    language = "javascript",
    value = "",
    onChange,
    ...props
}) => {
    const [code, setCode] = useState(value);

    const handleChange = (newValue) => {
        setCode(newValue || "");
        if (onChange) onChange(newValue || "");
    };

    return (
        <Editor
            language={language}
            theme="vs-dark"
            value={code}
            onChange={handleChange}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                automaticLayout: true,
                lineNumbers: "on",
            }}
            {...props}
        />
    );
};

export default CodeEditor;
