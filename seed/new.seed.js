
var cheerio = require('cheerio');
var request = require('request');
var Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
import KindOfNew from '../models/KindOfNew';
import _ from 'lodash';
import New from '../models/New';

const UetHostName = 'http://uet.vnu.edu.vn';

/**
 * parse trang chu để lấy dự liệu
 */

export const seed = async (mainUrl = 'http://uet.vnu.edu.vn/coltech/taxonomy/term/101') =>  {
    try {
        let bodyMain = await makeRequest(mainUrl);
        let kindOfNew = await saveKindOfNew(bodyMain);
        let kindOfNewHaveLastIndicator = await parseUrlLastIndicator(kindOfNew);
        let pages = await getPages(kindOfNewHaveLastIndicator);
        let newsNotHavePostAt = await getNewFromPage(pages);
        let newsUnique = deleteDuplicate(newsNotHavePostAt);
        let news = await getPostAtNews(newsUnique);
        console.log(news)
        await New.create(news);
        console.log('import success');
    }catch (err) {
        console.log(err);
    }
};

function saveKindOfNew(body) {
    return new Promise((res,rej)=>{
        let list = [];
        let $ = cheerio.load(body, {normalizeWhitespace: true, xmlMode: true});
        $('#block-menu-menu-tin-tuc-su-kien-r .menu .leaf')
            .each(function (i) {
                let link = `${UetHostName}${$('a', this).attr('href')}`;
                let name = $('a', this).text();
                if (i === 0) {
                    let kindOfNew = new KindOfNew({name, link: `${UetHostName}/coltech/taxonomy/term/101`});
                    return list.push(kindOfNew);
                }
                else if (i < 8) {
                    let kindOfNew = new KindOfNew({name, link});
                    return list.push(kindOfNew);
                }

            });

        KindOfNew.create(list)
            .then(result => res(result))
            .catch(err => KindOfNew.find({}))
            .then(result => res(result))
            .catch(err => rej(err));
    });

}

function parseUrlLastIndicator(list) {
    let funs = list.map((item) => {
        return getObjIndicator(item);
    });
    return Promise.all(funs);

}

async function getObjIndicator(loaiTinTuc) {
    return new Promise( async (res,rej) => {
        try{
            let body = await makeRequest(loaiTinTuc.link);
            var $ = cheerio.load(body, {normalizeWhitespace: true, xmlMode: true});
            var lastIndicator = $('.pager-last a').attr('href');
            var last = lastIndicator.split('=')[1];
            var obj = {
                link: loaiTinTuc.link,
                kind: loaiTinTuc.name,
                lastIndicator: parseInt(last),
                role: loaiTinTuc._id
            };
            return res(obj);
        }catch (err) {
            return rej(err);
        }
    });

}

function getPages(kindOfNewHaveLastIndicator) {
    return kindOfNewHaveLastIndicator.reduce( async (prevP,item) => {
        let prev = await prevP;
        let pages = [];
        for (let i =0 ;i <= item.lastIndicator;i ++){
            let url = `${item.link}?page=${i}`; //http://uet.vnu.edu.vn/coltech/taxonomy/term/93?page=0
            pages.push({link: url, role: item.role});
        }
        return [...prev,...pages];
    },Promise.resolve([]));
}

async function getNewFromPage(list) {
    return list.reduce( async (prevP,item) =>{
        let prev = await prevP;
        let result = await parseHtmlNew(item.link, item.role);
        return [...prev,...result];
    },Promise.resolve([]));
}
/**
 * parse new from a page
 * @param url
 * @param role
 * @returns {Promise.<Array>}
 */
async function parseHtmlNew(url, role) {
    return new Promise( async (resolve,reject) => {
        try {
            let body = await makeRequest(url);
            var list = [];
            var $ = cheerio.load(body, {normalizeWhitespace: true, xmlMode: true});
            $('.views-row').each(function(){
                var title = $('.field-content .title_term ', this).text();
                var link_temp = $('.field-content > a', this).attr('href');
                var imageLink = $('.field-content img', this).attr('src');
                //====================================
                var stringOnSpan = '';
                $('div.views-field-teaser>div>div>span', this).each(() => {
                    stringOnSpan += $('span').text();
                });
                if (stringOnSpan === '') {
                    stringOnSpan = $('div.views-field-teaser>div>div>div>span', this).text();
                }
                if (stringOnSpan === '') {
                    stringOnSpan = $('div.views-field-teaser>div>p', this).text();
                }
                if (stringOnSpan === '') {
                    stringOnSpan = $('div.views-field-teaser span', this).text();
                }
                //====================================
                var container = $('div.views-field-teaser>div>div>span>span>span', this).text()
                    || $('div.views-field-teaser>div>div>span>span', this).text()
                    || stringOnSpan;
                //tao model
                //link lấy về đoi khi cps kí tự dặc biệt
                //phai decode sang string
                if (title && link_temp && imageLink && container) {
                    list.push({
                        title: entities.decode(title).toLowerCase().trim(),
                        link: (UetHostName + link_temp).trim().toLowerCase(),
                        imageLink: imageLink.trim(),
                        content: entities.decode(container).toLowerCase().trim(),
                        kind: role
                    });
                }
            });

            return resolve(list);
        } catch (err) {
            return reject(err);
        }
    });
}

function deleteDuplicate(arr) {
    return _.uniqBy(arr, function(o){
        return o.link;
    });
}
/**
 * vì trong trang mail ko có thời gian post các bài viết nên
 * phair vào từng trang để lấy nên mất khá nhiều thì giờ
 * @param datas : mảng các tin tức
 * @param callback
 */
function getPostAtNews(listNew) {
    return listNew.reduce(async (prevP,item) => {
        let prev = await prevP;
        let result = await getPostAtANew(item);
        return [...prev,result];
    },[]);
}

function getPostAtANew(item) {
    return new Promise(async (res,rej)=>{
        try{
            let body = await makeRequest(item.link);
            let $ = cheerio.load(body, { normalizeWhitespace : true, xmlMode : true });
            let stringDate = $('.node .submitted').text().trim();
            let date = uniqueDate(stringDate);
            item['postAt'] = date;
            return res(item);
        }catch (err) {
            return rej(err);
        }
    });

}

function uniqueDate(string) {
    //string dang MM,DD,YYYY
    var stringDate = string.split(',')[1].trim().split(' ')[0].trim();
    var arr = stringDate.split('/');
    // new Date(YYYY,MM,DD)
    var str = arr[2].trim() + '-' + arr[0].trim() + '-' + arr[1].trim();
    var date = new Date(str.trim());
    return date;
}

//tao request trong async
function makeRequest(url) {
    return new Promise((res,rej) => {
        console.log(url);
        request({
            uri: url,
            method: 'get',
            timeout: 200000,
            followRedirect: true,
            maxRedirects: 10
        }, (err, response, body) => {
            if (err) return rej(err);
            return res(body);
        });
    });

}
