import { LocalStorageManager } from '../common/localStorateManager';
// import * as moment_ from 'moment';
import { EntityTypeMaster } from "../enums/entitytypemaster";

// const moment = moment_;
declare var $: any;
/**
* Convert Object to HttpParams
* @param {Object} obj
* @returns {HttpParams}
*/

export let HasPermission = (permissionId: number) => {
    if (permissionId != undefined && permissionId != null) {
        let localstoragemanager: any = new LocalStorageManager();
        var localStorageObject: any = localstoragemanager.getItem('userInfo') ? JSON.parse(localstoragemanager.getItem('userInfo')) : {};
        //let permissionIds: string = "";//"1001,1002,1003,1004,1005,1006,1007,1008,1009,1010,1011,1012,1013,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025,3001,3002,3003,3004,3005,3006,4001";
        let permissionIds: string = localStorageObject['PermissionIds'];

        if (permissionIds != null && permissionIds != undefined && permissionIds.length > 0) {
            let split_permissionIds = permissionIds.split(",");
            if (split_permissionIds.indexOf(permissionId.toString()) != -1) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    else
        return false;
}

// activeTabs Functionality ends here

// activeTabs Title Functionality
export let getActiveTabsLink = (currenttabs: any): void => {
    $('#currentactivemenu').data('menuitem-title', currenttabs); //setter
    var activemenu = $('#currentactivemenu').data('menuitem-title');
    $('span.navbar-brand').text(activemenu);
}

export let getActiveMenuName = (): any => {
    let pagetitle = ($('.sub-menu.active').attr('data-menuitem-title')) ? $('.sub-menu.active').attr('data-menuitem-title') : $('.parent-menu.active').attr('data-menuitem-title');
    //let pagetitle = ($('.sub-menu.active').attr('data-menuitem-title')) ? $('.sub-menu.active').attr('data-menuitem-title') : $('.parent-menu.active').attr('data-menuitem-title');
    return pagetitle.split('/')[1].replace(' ', '');
}

// activeTabs Title Functionality ends here

//set cardtype images
export let getCardImagePath = (imagepath: string, cardId: number): string => {
    if (imagepath == null || imagepath == undefined) {
        switch (cardId) {
            case 1450001:
                return './assets/img/visa_new.png';
            case 1450002:
                return './assets/img/mastercard_new_small.png';
            case 1450003:
                return './assets/img/amex_new_small.png';
            case 1450004:
                return './assets/img/discover_new_small.png';
            case 1450008:
                return './assets/img/dinerclub_new_small.png';
            case 1450012:
                return './assets/img/jcb_new_small.png';
            case 1450016:
                return './assets/img/paypal_new_small.png';
            case 1450006:
                return './assets/img/aus-debit_small.jpg';
            case 1450019:
                return './assets/img/aus-debit_small.jpg';
            case 1450020:
                return './assets/img/debit_new_small.png';
            default:
                return './assets/img/oth_new_small.png';
        }
    }
    else {
        return imagepath;
    }
}

export let getCardImagePathByCardNum = (cardnum: string): string => {
    if (cardnum == null || cardnum == undefined) {
        return "";
    }
    const firstLetter = cardnum[0];
    switch (firstLetter) {
        case '4':
            return './assets/img/visa_new.png';
        case '5':
            if ((cardnum[0] + '' + cardnum[1] == "51") || (cardnum[0] + '' + cardnum[1] == "52")
                || cardnum[0] + '' + cardnum[1] == "53" || cardnum[0] + '' + cardnum[1] == "54" || (cardnum[0] + '' + cardnum[1] == "55")) {
                return './assets/img/mastercard_new_small.png';
            }
            else {
                return './assets/img/oth_new_small.png';
            }
        case '3':
            if ((cardnum[0] + '' + cardnum[1] == "36") || (cardnum[0] + '' + cardnum[1] == "38")) {
                return './assets/img/dinerclub_new_small.png';
            }
            else if ((cardnum[0] + '' + cardnum[1] == "35")) {
                return './assets/img/jcb_new_small.png';
            }
            else if ((cardnum[0] + '' + cardnum[1] == "34") || (cardnum[0] + '' + cardnum[1] == "37")) {
                return './assets/img/amex_new_small.png';
            }
            else {
                return './assets/img/oth_new_small.png';
            }
        case '6':
            if ((cardnum[0] + '' + cardnum[1] == "65") || (cardnum[0] + '' + cardnum[1] == "60")) {
                return './assets/img/discover_new_small.png';
            }
            else {
                return './assets/img/oth_new_small.png';
            }
        default:
            return './assets/img/oth_new_small.png';
    }
}
//end of cardtype images

export function FormatString(str: string, ...val: string[]) {

    for (let index = 0; index < val.length; index++) {

        str = str.replace(`{${index}}`, val[index]);
    }
    return str;
}


// Reset the Search Fields that are based on ID
export function ResetSearchFieldsByParams(haystack: string[], needle: string | null): void {
    for (let index = 0; index < haystack.length; index++) {
        if (needle != null) {
            $("#" + needle).val('');
        } else {
            $('#' + haystack[index]).val('');
        }
    }
}

// Function to loop in the Hidden Columns
export function LoopHiddenColumns(hiddenFieldValues: any): void {
    //console.log(hiddenFieldValues);
    for (var i = 0; i < hiddenFieldValues.length; i++) {
        $("[data-show-column=" + hiddenFieldValues[i] + "]").addClass("hidden");
        HideColumnsGrid(hiddenFieldValues[i]);
    }
}
// Method to Hide Columns in UI Grid
export function HideColumnsGrid(hiddenFieldValues: string): void {
    let numberofTimes = 0;
    let intervalFn = setInterval(() => {
        numberofTimes += 1;
        let hiddenClassSelector = $("[data-show-column=" + hiddenFieldValues + "].hidden");
        let hiddenFieldSelector = $("[data-show-column=" + hiddenFieldValues + "]");
        // if( hiddenFieldSelector.length != hiddenClassSelector.length){
        $("[data-show-column=" + hiddenFieldValues + "]").addClass("hidden");
        // } else {
        if (numberofTimes == 5) {
            clearInterval(intervalFn);
        }
    }, 100);
}

// export let SetDate = (date: any): any => {
//     //console.log("moment().format('YYYY-MM-DD')",moment().format('YYYY-MM-DD'));
//     return (date != undefined && date != null) ? moment(date).format('YYYY-MM-DDT12:00:00Z') : moment().format('YYYY-MM-DDT12:00:00Z');
// }

// export let SetStartDate = (date: any, noOfDays: any = 6): any => {
//     //console.log("start date",moment(date).subtract(7, 'd').format('YYYY-MM-DD'));
//     return moment(date).subtract(noOfDays, 'd').format('YYYY-MM-DDT12:00:00Z');
// }

// Function to convert Uint8Array to Base64 String
export function ConvertUINT8ArrayToString(myUint8Arr: any) {
    return String.fromCharCode.apply(null, myUint8Arr);
}

// Function to convert base64 String to Uint8Array TypedArray
export function base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

//Function to format the Date.
// export function formatDateyyyymmdd(presentdate: any, month: any, year: any) {
//     var firstDay;
//     var lastDay;
//     var selectedyear;
//     if (year != null && year.length > 2) {
//         selectedyear = parseInt(moment(year, "YYYY").format("YYYY"));
//     }
//     else {
//         selectedyear = parseInt(moment(year, "YY").format("YYYY"));
//     }
//     var months = parseInt(moment().month(month).format("M")) - 1;
//     if (presentdate) {
//         firstDay = new Date(selectedyear, months, presentdate);
//         lastDay = new Date(selectedyear, months, presentdate);
//     } else {
//         firstDay = new Date(selectedyear, months, 1);
//         lastDay = new Date(selectedyear, months + 1, 0);
//     }

//     return { startDate: firstDay, endDate: lastDay };
// }

// Check if Object has key
export const hasProperty = (object: any, key: any): any => {
    const has = Object.prototype.hasOwnProperty;
    return has.call(object, key);
}
