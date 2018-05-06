/* eslint-disable indent,no-mixed-spaces-and-tabs */
const rp = require('request-promise');
const cheerio = require('cheerio');
const _ = require('lodash');
const PAGE_CRAWL = 'https://uet.vnu.edu.vn/category/tin-tuc/tin-sinh-vien/';
const moment = require('moment');
import New from '../models/New';

const options = (uri) =>{
    return {
        uri,
        transform: function (body) {
            return cheerio.load(body,{
                withDomLvl1: true,
                normalizeWhitespace: false,
                xmlMode: false,
                decodeEntities: true
            });
        }
    };
};

const getUrlPageContainer = (position) => {
    return `${PAGE_CRAWL}page/${position}`;
};

const getPageContainerList = ($) => {
    let urlPageLast = $('.wp-pagenavi .last')[0].attribs['href'].toString().trim();
    let indexPageLast = null;
    let parts = urlPageLast.split('/');
    if (parts[parts.length-1].length === 0){
        indexPageLast = parseInt(parts[parts.length-2]);
    } else {
        indexPageLast = parseInt(parts[parts.length-1]);
    }

	//create list
    let list = [];
    for (let iPage = 1; iPage <= indexPageLast; iPage++) {
        list.push(getUrlPageContainer(iPage));
    }
    return list;

};

function trimSpace(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

function parseContainerPagePromise(url) {
    return new Promise((resolve, reject) => {
        rp(options(url))
			.then($ => {
			    let newInPageList = [];
			    $('.post-item.blog-post-item.row').each((key,row) => {
			        const title = trimSpace($(row).find('h3 a').text());
			        const link = trimSpace($(row).find('h3 a').attr('href'));
			        const content = trimSpace($(row).find('.item-excerpt > p').text());
			        const imageLink = trimSpace($(row).find('.item-thumbnail img').attr('src'));
								//time post
			        const month = parseInt(trimSpace($(row).find('.month').text().substr(2)));
			        const day = parseInt(trimSpace($(row).find('.day').text()));
                    let year = 2018;
                    // if(month > (moment().month() + 1)){
			         //    year = 2017;
                    // } else if(month === (moment().month() + 1)){
			         //    if(day > moment().date()){
			         //        year = 2017;
                    //     }else {
			         //        year = 2018;
                    //     }
                    // } else {
			         //    year = 2018;
                    // }
                    let hour = moment(moment()).format('HH:mm:ss');
			        const postAt =  moment(`${month}-${day}-${year}T${hour}`, 'MM-DD-YYYYTHH:mm:ss');
								//footer tag and user post
			        const tags = [];
			        $(row).find('a[rel=\'category tag\']').each((key,item) => {
			            tags.push(trimSpace($(item).text()));
			        });
								// user post
			        let meta = $('.item-meta > span').first().text().trim();
			        const author = trimSpace(meta.substr(0,meta.length-1));

			        newInPageList.push(new New({
			            title,
                        link,
			            content,
                        imageLink,
                        postAt,
                        tags,
			            author
			        }));
			    });
			    resolve(newInPageList);
			})
	        .catch(reject);
    });
}

export const getNewsInpage = (url) => {
	return parseContainerPagePromise(url);
};

export const getAllNews = () => {
	return new Promise((resolve, reject) => {
        rp(options(PAGE_CRAWL))
            .then(function ($) {
                let containerPageList = getPageContainerList($);
                let parseContainerPagePromiseList =  _.map(containerPageList,parseContainerPagePromise);
                Promise.all(parseContainerPagePromiseList)
                    .then(_.flatten)
                    .then(resolve);
            })
            .catch(reject);
	});
};

export const getAllKindOfNews = (news) => {
    return _(news)
        .map(item => _.flatten(item.tags))
        .flatten()
        .union()
        .value();
};

export const parseDetailNew = (url) => {
    return rp(options(url))
        .then($ => {
            const content = $('#content');
            const title = content.find('article .single-content-title').text();
            const main = content.find('.single-post-content-text.content-pad').html();
            return {
                title,
                main
            };
        });
};