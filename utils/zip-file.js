import JSZip from "jszip";

async function zipTextToBytes(text, filename) {
    // Takes in text, creates a zip file with the text as a file inside it, and returns the zip file as a byte array
    const zip = new JSZip();
    zip.file(filename, text);
    const content = await zip.generateAsync({ type: "uint8array" });
    return content;
}


async function unzipBlob(blob, filename) {
    const zip = new JSZip();
    const content = await zip.loadAsync(blob);
    const text = await content.file(filename).async("string");
    return text;
}

async function unzipBlobToJSON(blob) {
    return JSON.parse(await unzipBlob(blob, "match.json"));
}

async function unzipBlobToCode(blob) {
    return await unzipBlob(blob, "player.py");
}

export { zipTextToBytes, unzipBlob, unzipBlobToJSON, unzipBlobToCode };