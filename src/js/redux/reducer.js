import { combineReducers } from 'redux';

import {
    NEW_ORDER_DATA,
    CHANGE_SALES_FILTERS,
    CHANGE_SEARCH_TEXT,
    CHANGE_SEARCH_FLAG,
    NEW_FLAG_DATA,
    NEW_RESOURCE_DATA,
    CHANGE_GDN_POSTCODE
} from './actions';

function bigChange(
    state = {
        flags: [],
        resources: [],
        jobs: []
    },
    action
) {
    switch (action.type) {
        case NEW_RESOURCE_DATA:
            return Object.assign({}, state, {
                resources: action.resources
            });
        case NEW_ORDER_DATA:
            return Object.assign({}, state, {
                jobs: action.jobs
            });
        case NEW_FLAG_DATA:
            return Object.assign({}, state, {
                flags: action.flags
            });
        default:
            return state;
    }
}

function orderStatus(
    state = {
        searchText: "",
        searchFlag: ""
    },
    action
) {
    switch (action.type) {
        case CHANGE_SEARCH_TEXT:
            return Object.assign({}, state, {
                searchText: action.searchText
            })
        case CHANGE_SEARCH_FLAG:
            return Object.assign({}, state, {
                searchFlag: action.searchFlag
            })
        default:
            return state;
    }
}

function sales(
    state = {
        start: new Date(),
        end: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        surveyor: "Andy Marshall"
    },
    action
) {
    switch (action.type) {
        case CHANGE_SALES_FILTERS:
            return Object.assign({}, state, {
                start: action.start,
                end: action.end,
                surveyor: action.surveyor
            });
        default:
            return state;
    }
}

function gdn(
    state = {
        postcode: ""
    },
    action
) {
    switch(action.type) {
        case CHANGE_GDN_POSTCODE:
            return Object.assign({}, state, {
                postcode: action.postcode
            });
        default:
            return state;
    }
}

export default combineReducers({
    bc: bigChange,
    orderStatus,
    sales,
    gdn
});