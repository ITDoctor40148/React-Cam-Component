import * as actions from './links-action-type';

const store = {
    links: []
}

const linksReducer = (state = store, action) => {
    switch (action.type) {
        case actions.PUT:
            return {...state, links: [...state.links, action.payload]};
        default:
            return state;
    }
}

export default linksReducer;