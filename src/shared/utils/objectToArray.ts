export default function objectToArray(arr: Array<Object>){
    return  arr.map(m => {return Object.values(m)[0]})
}