export default function censorDocuments(doc:string){
    if (doc.length == 11) {
        return `***${doc.substring(4,9)}**`
    }
    return doc
}