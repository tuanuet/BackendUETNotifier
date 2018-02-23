'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * create matrix example
 * {
 *  1 :[[column,row],...],
 *  2 :[..]
 * }
 * @param worksheet
 */
function getMatrixInWorksheet(worksheet) {
    return _(worksheet).map(function (brick, key) {
        return key[0] !== '!' ? key : '';
    }).compact().union().map(getDimension).groupBy(function (item) {
        return item[1];
    }).value();
}

var labelFromDimension = function labelFromDimension(arr) {
    return arr.join('');
};
var getRow = function getRow(label) {
    return label.split(/(\d+)/)[1];
};
var getColumn = function getColumn(label) {
    return label.split(/(\d+)/)[0];
};
var getDimension = function getDimension(label) {
    return label.split(/(\d+)/).filter(function (i) {
        return i !== '';
    });
};

var getValue = function getValue(worksheet) {
    return function (label) {
        return isNaN(Number(worksheet[label].v)) ? worksheet[label].v : Math.round(Number(worksheet[label].v) * 100) / 100;
    };
};

var getRowHtml = function getRowHtml(worksheet, arrLable) {
    return '<tr><td>' + _(arrLable).map(getValue(worksheet)).join('</td><td>') + '</td></tr>';
};

var getLabelThead = function getLabelThead(worksheet, matrix) {
    var indexThead = void 0;
    _(matrix).forEach(function (index) {
        var labelSTT = _(index).map(labelFromDimension).filter(function (label) {
            return worksheet[label].v.toString().indexOf('STT') > -1;
        }).value();
        if (labelSTT.length !== 0) {
            indexThead = getDimension(labelSTT[0]);
            return;
        }
    });
    var rowHead = _(matrix).filter(function (dim, key) {
        return key === indexThead[1];
    }).value()[0];

    var _loop = function _loop(i) {
        var j = i + 1;
        if (rowHead[j][0].charCodeAt(0) - rowHead[i][0].charCodeAt(0) > 1) {
            var _rowHead;

            var rowBelow = _(matrix).filter(function (item, key) {
                return parseInt(key) === parseInt(rowHead[i][1]) + 1;
            }).value()[0];
            (_rowHead = rowHead).splice.apply(_rowHead, [i, 1].concat(_toConsumableArray(rowBelow)));
            rowHead = _(rowHead).sortBy(function (i) {
                return i[0];
            }).value();
        }
    };

    for (var i = 0; i < rowHead.length - 1; i++) {
        _loop(i);
    }
    return _(rowHead).map(labelFromDimension).value();
};

var getLabelByRow = function getLabelByRow(worksheet, matrix, headersLabel) {
    var maxRowInHeader = Number(_(headersLabel).map(getDimension).maxBy(function (item) {
        return item[1];
    })[1]);
    var startBody = maxRowInHeader + 1;

    //todo : select min and max body
    return _(matrix).filter(function (item, key) {
        return key >= Number(startBody);
    }).filter(function (item, key) {
        var label = labelFromDimension(item[0]);
        return !isNaN(Number(worksheet[label].v));
    }).map(function (points) {
        return _(points).map(labelFromDimension).value();
    }).value();
};

function retnum(str) {
    var num = str.replace(/[^0-9]/g, '');
    return num;
}

/**
 * courseName: courseName, lecturer: lecturer, idCourse: idCourse, nameTerm: nameTerm
 * @param worksheet
 * @param matrix
 * @returns {{courseName: *, lecturer: *, idCourse: *, nameTerm: *}}
 */
var getInfoClass = function getInfoClass(worksheet, matrix) {

    var courseName = void 0,
        lecturer = void 0,
        idCourse = void 0,
        nameTerm = void 0;
    var z = void 0;
    for (z in worksheet) {
        /* all keys that do not begin with "!" correspond to cell addresses */
        if (z[0] === '!') continue;
        //============================================================
        //============================================================
        if (JSON.stringify(worksheet[z].v).indexOf('Môn học') > -1) {
            var columnMh = String.fromCharCode(67 + (z.charCodeAt(0) - 65)); //tinh them 2 o nua
            var row = parseInt(retnum(z));
            courseName = worksheet[columnMh + row].v;
        }
        if (JSON.stringify(worksheet[z].v).indexOf('Giảng viên:') > -1) {
            var columnGv = String.fromCharCode(67 + (z.charCodeAt(0) - 65)); //tinh them 2 o nua
            var row = parseInt(retnum(z));
            lecturer = worksheet[columnGv + row].v;
        }
        if (JSON.stringify(worksheet[z].v).indexOf('Lớp môn học') > -1) {
            var columnLopmh = String.fromCharCode(67 + (z.charCodeAt(0) - 65)); //tinh them 2 o nua
            var row = parseInt(retnum(z));
            idCourse = _.snakeCase(worksheet[columnLopmh + row].v);
        }
        if (JSON.stringify(worksheet[z].v).indexOf('Năm học') > -1) {
            nameTerm = worksheet[z].v;
        }
    }

    return {
        courseName: courseName, lecturer: lecturer, idCourse: idCourse, nameTerm: nameTerm
    };
};

var process = function process(workbook, cb) {
    var sheets = workbook.SheetNames;
    var worksheet = workbook.Sheets[sheets[0]];
    var matrix = getMatrixInWorksheet(worksheet);
    var informationClass = void 0;
    var thead = void 0;
    var tbody = void 0;
    var headersLabel = getLabelThead(worksheet, matrix);
    thead = getRowHtml(worksheet, headersLabel);

    //================================================================
    var rowBody = getLabelByRow(worksheet, matrix, headersLabel);
    var rows = _(rowBody).map(function (row) {
        return getRowHtml(worksheet, row);
    }).value();

    tbody = '<tbody>' + rows.join('') + '</tbody>';

    //================================================================
    informationClass = getInfoClass(worksheet);

    //================================================================
    var points = _(rowBody).map(function (row) {
        return _(row).map(getValue(worksheet)).value();
    }).value();

    let data = {
        headers : _(headersLabel).map(function (item) {
            return worksheet[item].v;
        }).value(),
        points : points,
        informationClass : informationClass
    }
    cb(thead, tbody, data);
};