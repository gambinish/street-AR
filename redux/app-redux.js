import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import geoPoints from '../data/GeoPoints.js';

const coords = geoPoints;

// INITIAL STATE
const initialState = {
  id: null,
  artistName: '',
  geoPoints: [],
  selectedLibrary: null,
  renderOne: false
};


// REDUCERS
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "findArtist":
      console.log('ACTION FIRED:', action.type)
      console.log(action.payload)
      return { ...state, artistName: action.payload }
    case "getMuralLocations":
      // console.log('action.payload in REDUCER:', action.payload)
      return { ...state, geoPoints: action.payload }
    case "expandDetail":
      console.log('ACTION.TYPE: ', action.type)
      console.log('ACTION.PAYLOAD: ', action.payload)
      return { ...state, selectedLibrary: action.payload }
    case "getMuralLocationById":
      return { ...state, geoPoints: action.payload };
    case "toggleFalse":
      console.log('TOGGLE FALSE')
      return { ...state, renderOne: action.payload };
    case "toggleTrue":
      console.log('TOGGLE TROOF')
      return { ...state, renderOne: action.payload };
    default:
      return state
  }
};


// STORE
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
export { store };


// ACTION CREATORS
const getMuralLocations = () => {
  return {
    type: "getMuralLocations",
    payload: coords
  }
}
export { getMuralLocations }


const findArtist = (artistName) => {
  return {
    type: "findArtist",
    payload: artistName
  }
}
export { findArtist }

const expandDetail = (libraryId) => {
  // console.log('ACTION HIT')
  return {
    type: "expandDetail",
    payload: libraryId
  }
}
export { expandDetail }

const getMuralLocationById = (id) => {
  return {
    type: "getMuralLocationById",
    payload: coords.filter(e => {
      return id.toString() === (e.id).toString()
    })
  }
}
export { getMuralLocationById }

const toggleFalse = () => {
  return {
    type: "toggleFalse",
    payload: false
  }
}
export { toggleFalse }

const toggleTrue = () => {
  return {
    type: "toggleTrue",
    payload: true
  }
}
export { toggleTrue }