export const NEW_RESOURCE_DATA = 0;

export function newResourceData(resources) {
    return {
        type: NEW_RESOURCE_DATA,
        resources
    };
}

export const NEW_ORDER_DATA = 1;

export function newOrderData(jobs) {
    return {
        type: NEW_ORDER_DATA,
        jobs
    };
}

export const NEW_FLAG_DATA = 2;

export function newFlagData(flags) {
    return {
        type: NEW_FLAG_DATA,
        flags
    }
}

export const CHANGE_SALES_FILTERS = 3;

export function changeSalesFilters(start, end, surveyor) {
    return {
        type: CHANGE_SALES_FILTERS,
        start, 
        end, 
        surveyor
    }
}

export const CHANGE_SEARCH_TEXT = 4;

export function changeSearchText(searchText) {
    return {
        type: CHANGE_SEARCH_TEXT,
        searchText
    }
}

export const CHANGE_SEARCH_FLAG = 5;

export function changeSearchFlag(searchFlag) {
    return {
        type: CHANGE_SEARCH_FLAG,
        searchFlag
    }
}

export const CHANGE_GDN_POSTCODE = 6;

export function changeGDNPostcode(postcode) {
    return {
        type: CHANGE_GDN_POSTCODE,
        postcode
    }
}

export const NEW_WORKSHEET_DATA = 7;

export function newWorksheetData(worksheets) {
    return {
        type: NEW_WORKSHEET_DATA,
        worksheets,
        show: true
    }
}

export const HIDE_WORKSHEET_DATA = 8;

export function hideWorksheetData() {
    return {
        type: HIDE_WORKSHEET_DATA,
        show: false
    }
}