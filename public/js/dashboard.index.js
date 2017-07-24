/**
 * Created by vmt on 21/07/2017.
 */
'use strict';

function trSort(index) {

    var arrayTH = $('#datatable-buttons').find('thead th');
    var index = parseInt(index);
    var status = $(arrayTH[index]).attr('status');

    /**
     * sort tr in tbody
     * @type {jQuery}
     */
    var list = $('#datatable-buttons').find('tbody tr').sort(function (a, b) {

        var tempA = $($(a).children('td')[index]).html().trim();
        var tempB = $($(b).children('td')[index]).html().trim();
        var valueA = !isNaN(parseInt(tempA)) ? parseInt(tempA) : tempA;
        var valueB = !isNaN(parseInt(tempB)) ? parseInt(tempB) : tempB;

        if (valueA === valueB ) return 0;
        /**
         * check status th to
         */
        if (status === undefined || status === ''){
            return valueA < valueB ? -1: 1;
        }else if(status === 'asc'){
            return valueA < valueB ? 1: -1;
        }

    });
    /**
     * clear tbody
     * @type {*}
     */
    var tbody = $('tbody');
    tbody.html('');

    /**
     * add attribute th
     */
    if (status === 'asc'){
        arrayTH.map(function (i) {
            $(arrayTH[i]).attr('status','');
        });
    }else{
        arrayTH.map(function (i) {
            if(i === index)
                $(arrayTH[i]).attr('status','asc');
            else
                $(arrayTH[i]).attr('status','');
        });
    }

    /**
     * append vao html
     */
    list.map(function (i) {
        tbody.append(list[i]);
    });

}