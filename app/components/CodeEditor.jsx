import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

const CodeEditor = ({
    language = "python",
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
        <CodeMirror
            extensions={[python()]}
            value={code}
            onChange={handleChange}
            fontSize={14}
            width="100%"
            style={{textAlign: "left"}}
            theme={"dark"}
            {...props}
        />
    );
};

export default CodeEditor;
