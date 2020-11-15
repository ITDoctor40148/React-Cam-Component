import * as actions from './links-action-type';

export const addLink = links => ({ type: actions.PUT, payload: links })

export const removeLink = index => ({type: actions.REMOVE, payload: index})