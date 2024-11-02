import _ from 'lodash';

export const randomDate=(start, end)=> {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
export const getPosition =(string, subString, index) => {
    return string.split(subString, index).join(subString).length;
}
export const formatDate=(date)=> {
    var formatDate = document.getElementById("formatDate").value;
    const d = new Date(date)
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
    switch(formatDate){
        case 'yyyy-mm-dd':
            return `${ye}-${mo}-${da}`;
        case 'yyyy/mm/dd':
            return `${ye}/${mo}/${da}`;
        case 'yyyymmdd':
            return `${ye}${mo}${da}`;
        case 'dd-mm-yyyy':
            return `${da}-${mo}-${ye}`;
        case 'dd/mm/yyyy':
            return `${da}/${mo}/${ye}`;
        case 'ddmmyyyy':
            return `${da}${mo}${ye}`;
         default:
                break;
    }
    return `${ye}${formatDate}${mo}${formatDate}${da}`;
}
export const checkType=(line, arrayType) =>{
    var result = false;
    arrayType.forEach(type=>{
        if (line.includes(type)) {
            result=true;
        }
    });
    return result;
}
export const replaceArr =(line, arrayType, valRpl) => {
    for(let i=0; i<arrayType.length; i++){
       var type = arrayType[i];
        line = line.replaceAll(`${type}`, valRpl);
    }

    return line;
}
export const checkIncludesArr =(line, arrayStr, sensitive) => {
    if(!sensitive){
        line= line.toUpperCase();
    }
    for(let i=0; i<arrayStr.length; i++){
       var  str= arrayStr[i];
       if(line.includes(str)){
        return true;
       }
    }

    return false;
}

export const randomList =(arr) => {
    if(!_.isEmpty(arr)){
        var item = arr[Math.floor(Math.random()*arr.length)];
        return item;
    }

    return "";
}

export const isEqualStr = (str1, str2, isCaseInte) => {
    if (str1 == null || str2 == null) {
        return false;
    }
    let arr = [' ', '   ', ',', '.', '!', '?', '’', "'", '<', '>',
                '—', ':', '[', ']', '(', ')', '*', '-', '+', '=',
                 '@', '#', '%', '^', '&', '!']
    replaceArr(str1, arr, "")
    replaceArr(str2, arr, "")
    if (isCaseInte === true) {
        str1 = str1.trim().toUpperCase();
        str2 = str2.trim().toUpperCase();
    }
    return _.isEqual(str1, str2);
}

export const setCharAt = (str,index,chr) => {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}