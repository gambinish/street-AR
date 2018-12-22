import React from 'react';
import { View } from 'react-native';

import { connect } from 'react-redux';

// REDUX MAPPING CONFIG
const mapStateToProps = (state) => {
  return {
    id: state.id,
    artistName: state.artistName,
    geoPoints: state.geoPoints
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    findArtist: (text) => {
      dispatch(findArtist(text))
    },
    getMuralLocations: () => {
      dispatch(getMuralLocations())
    }
  };
}

const Card = (props) => {
  // console.log('CARD PROPS', props)
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);