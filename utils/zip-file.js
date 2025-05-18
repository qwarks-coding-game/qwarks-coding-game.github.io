import JSZip from "jszip";

async function zipTextToBytes(text, filename) {
    // Takes in text, creates a zip file with the text as a file inside it, and returns the zip file as a byte array
    const zip = new JSZip();
    zip.file(filename, text);
    const content = await zip.generateAsync({ type: "uint8array" });
    return content;
}

async function unzipBlobToJSON(blob) {
    const zip = new JSZip();
    const content = await zip.loadAsync(blob);
    const jsonFile = await content.file("match.json").async("string");
    return JSON.parse(jsonFile);
}

export { zipTextToBytes, unzipBlobToJSON };