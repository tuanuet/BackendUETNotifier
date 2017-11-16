/**
 * create matrix example
 * {
 *  1 :[[column,row],...],
 *  2 :[..]
 * }
 * @param worksheet
 */
function getMatrixInWorksheet(worksheet) {
    return _(worksheet)
        .map((brick,key) => {
            return key[0] !== '!' ? key : '';
        })
        .compact()
        .union()
        .map(getDimension)
        .groupBy(item => item[1])
        .value();
}

let labelFromDimension = (arr) => arr.join('');
let getRow = (label) => label.split(/(\d+)/)[1];
let getColumn = (label) => label.split(/(\d+)/)[0];
let getDimension = (label) => label.split(/(\d+)/).filter(i => i !== '');

let getValue = worksheet => label => isNaN(Number(worksheet[label].v)) ?
    worksheet[label].v : Math.round(Number(worksheet[label].v) * 100) / 100;

let getRowHtml = (worksheet,arrLable) => '<tr><td>' + _(arrLable).map(getValue(worksheet)).join('</td><td>') + '</td></tr>';

let getLabelThead = (worksheet,matrix) => {
    let indexThead;
    _(matrix).forEach((index) => {
        let labelSTT = _(index)
            .map(labelFromDimension)
            .filter(label => {
                return worksheet[label].v.toString().indexOf('STT') > -1;
            }).value();
        if(labelSTT.length !== 0){
            indexThead = getDimension(labelSTT[0]);
            return;
        }
    });
    let rowHead = _(matrix).filter((dim,key) => {
        return key === indexThead[1];
    }).value()[0];

    for(let i = 0; i < rowHead.length-1; i++){
        let j= i+1;
        if(rowHead[j][0].charCodeAt(0)-rowHead[i][0].charCodeAt(0) > 1){
            let rowBelow = _(matrix).filter((item,key) => {
                return parseInt(key) === parseInt(rowHead[i][1]) + 1;
            }).value()[0];
            rowHead.splice(i,1,...rowBelow);
            rowHead = _(rowHead).sortBy( i=> i[0]).value();
        }
    }
    return _(rowHead).map(labelFromDimension).value();
};

let getLabelByRow = (worksheet,matrix,headersLabel) => {
    let maxRowInHeader = Number(_(headersLabel).map(getDimension).maxBy(item => item[1])[1]);
    let startBody = maxRowInHeader + 1;

    //todo : select min and max body
    return _(matrix)
        .filter((item,key) => key >= Number(startBody))
        .filter((item,key) => {
            let label = labelFromDimension(item[0]);
            return !isNaN(Number(worksheet[label].v));
        })
        .map(points => _(points).map(labelFromDimension).value())
        .value();

};

function retnum(str) {
    var num = str.replace(/[^0-9]/g, '');
    return num;
}

let getInfoClass = (worksheet,matrix) => {

    let courseName,lecturer,idCourse,nameTerm;
    let z;
    for (z in worksheet) {
        /* all keys that do not begin with "!" correspond to cell addresses */
        if (z[0] === '!') continue;
        //============================================================
        //============================================================
        if (JSON.stringify(worksheet[z].v).indexOf('Môn học') > -1) {
            var columnMh = String.fromCharCode(67 + (z.charCodeAt(0) - 65));//tinh them 2 o nua
            var row = parseInt(retnum(z));
            courseName = worksheet[columnMh + row].v;
        }
        if (JSON.stringify(worksheet[z].v).indexOf('Giảng viên:') > -1) {
            var columnGv = String.fromCharCode(67 + (z.charCodeAt(0) - 65));//tinh them 2 o nua
            var row = parseInt(retnum(z));
            lecturer = worksheet[columnGv + row].v;
        }
        if (JSON.stringify(worksheet[z].v).indexOf('Lớp môn học') > -1) {
            var columnLopmh = String.fromCharCode(67 + (z.charCodeAt(0) - 65));//tinh them 2 o nua
            var row = parseInt(retnum(z));
            nameTerm = worksheet[columnLopmh + row].v;
        }
        if (JSON.stringify(worksheet[z].v).indexOf('Năm học') > -1) {
            idCourse = worksheet[z].v;
        }
    }

    return {
        courseName,lecturer,idCourse,nameTerm
    };
};

let process = (workbook,cb) => {
    let sheets = workbook.SheetNames;
    let worksheet = workbook.Sheets[sheets[0]];
    let matrix = getMatrixInWorksheet(worksheet);
    let infomationClass;
    let thead;
    let tbody;
    let headersLabel = getLabelThead(worksheet,matrix);
    thead = getRowHtml(worksheet,headersLabel);

    //================================================================
    let rowBody = getLabelByRow(worksheet,matrix,headersLabel);
    let rows = _(rowBody).map(row => {
        return getRowHtml(worksheet,row);
    }).value();
    tbody = '<tbody>' + rows.join('')+'</tbody>';

    //================================================================
    infomationClass = getInfoClass(worksheet);

    cb(thead,tbody,infomationClass);
};
