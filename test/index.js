// var express = require('express');
// var bodyParser = require('body-parser');
// var async = require('async');
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

function retnum(str) {
    var num = str.replace(/[^0-9]/g, '');
    return num;
}

function process(workbook) {

    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function (y) { /* iterate through sheets */
        let worksheet = workbook.Sheets[y];
        let numberRow = 0;
        let begin; //cot dau tien chua so STT cua sinh vien
        let beginFromNumberRow; // hang dau tien chua tu 'STT'
        let result;
        let z;
        for (z in worksheet) {
            /* all keys that do not begin with "!" correspond to cell addresses */
            if (z[0] === '!') continue;

            if (JSON.stringify(worksheet[z].v).indexOf('STT') >= 0) {
                begin = z.charAt(0);
                beginFromNumberRow = retnum(z);
            }
        }

        //function 2
        var mang = new Array(); // mang chua cac hang trong exel co gia tri la cac so thu tu cua sinh vien
        for (z in worksheet) {
            /* all keys that do not begin with "!" correspond to cell addresses */
            if (z[0] === '!') continue;

            if (z.indexOf(begin) >= 0) {  //yeu cau gia tri cua o phai chua ki tu o funciton 1

                if (retnum(z) > beginFromNumberRow && !isNaN(worksheet[z].v)) { //tinh tu hang chua 'STT' duyet tat ca cac so thu tu, neu k phai so thu tu k lay
                    //console.log(retnum(z));
                    mang.push(parseInt(retnum(z)));//add hang exel vao mang
                }
            }
        }
        var beginSV = mang[0]; //so thu tu hang trong exel chua sinh vien dau tien
        var endSV = mang[mang.length - 1];// so tu tu trong exel chua sinh vien cuoi cung
        var rowSTT = beginFromNumberRow;//so thu tu cua hang chua 'STT'
        var colSTT = begin; //cot exel chua 'STT'

        //function 3
        var tenMonHoc;
        var tenGv;
        var tenLopMonHoc;
        var tenKiHoc;

        //===========================
        var array = [];
        var Objects = [];
        var mang = [];
        for (z in worksheet) {
            /* all keys that do not begin with "!" correspond to cell addresses */
            if (z[0] === '!') continue;
            //============================================================
            //============================================================

            if (JSON.stringify(worksheet[z].v).indexOf('Môn học') > -1) {
                var columnMh = String.fromCharCode(67 + (z.charCodeAt(0) - 65));//tinh them 2 o nua
                var row = parseInt(retnum(z));
                tenMonHoc = worksheet[columnMh + row].v;
            }
            if (JSON.stringify(worksheet[z].v).indexOf('Giảng viên:') > -1) {
                var columnGv = String.fromCharCode(67 + (z.charCodeAt(0) - 65));//tinh them 2 o nua
                var row = parseInt(retnum(z));
                tenGv = worksheet[columnGv + row].v;
            }
            if (JSON.stringify(worksheet[z].v).indexOf('Lớp môn học') > -1) {
                var columnLopmh = String.fromCharCode(67 + (z.charCodeAt(0) - 65));//tinh them 2 o nua
                var row = parseInt(retnum(z));
                tenLopMonHoc = worksheet[columnLopmh + row].v;
            }
            if (JSON.stringify(worksheet[z].v).indexOf('Năm học') > -1) {
                tenKiHoc = worksheet[z].v;
            }

            //=========================================================
            //=========================================================

            if (parseInt(retnum(z)) === beginSV) {
                mang.push(z);
            }
        }
        var infomationLopMonHoc = {
            tenKiHoc: tenKiHoc,
            tenGiangVien: tenGv,
            tenLopMonHoc: tenLopMonHoc,
            monHoc: tenMonHoc
        };
        console.log(infomationLopMonHoc);
        /*
        //console.log(mang);

        //ten column cuoi cung co chua thong tin cua sinh vien
        var NameColumn = mang[mang.length - 1].charAt(0);
        //console.log(NameColumn);
        var gan = [];
        for (var i = 0; i < mang.length; i++) {
            gan[i] = String.fromCharCode(65 + i);
        }

        $('.table-scores').find('tr:gt(0)').remove();
        //console.log(gan[0]+kq.beginSV);
        for (var i = beginSV; i <= endSV; i++) {
            // var dem=0;
            var object = new Object({
                STT: worksheet[gan[0] + i].v,
                MSV: worksheet[gan[1] + i].v,
                HoTen: worksheet[gan[2] + i].v,
                NgaySinh: worksheet[gan[3] + i].v,
                LopChinh: worksheet[gan[4] + i].v,
                diemThanhPhan: worksheet[gan[5] + i].v,
                diemCuoiKi: worksheet[gan[6] + i].v,
                tongDiem: worksheet[gan[7] + i].v
            });
            var new_row = '<tr><td>'+object.STT+'</td><td>'+object.MSV+'</td><td>'+object.HoTen+'</td><td>'+object.NgaySinh+'</td><td>'+object.LopChinh+'</td><td>'+object.diemThanhPhan+'</td><td>'+object.diemCuoiKi+'</td><td>'+object.tongDiem+'</td></tr>';
            $('.table-scores').append(new_row);
            console.log(object);
            Objects.push(object);
        }
        console.log(Objects);
        TableAdvanced.init();
        */
    });
//=======================================================================
//fuction lay gia tri number tu string
}
(function () {
    try{
        var workbook = XLSX.readFile(path.join(__dirname,'diem.xls'));
        process(workbook);

    }catch(err){
        console.log(err);
    }
})();