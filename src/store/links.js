import * as actions from './links-action-type';

const store = {
    links: []
}

const linksReducer = (state = store, action) => {
    switch (action.type) {
        case actions.PUT:
            return { ...state, links: [...state.links, action.payload] };
        case actions.REMOVE:
            const links = [...state.links.slice(0, action.payload), ...state.links.slice(action.payload + 1)];
            return { ...state, links: links};
        default:
            return state;
    }
}

export default linksReducer;