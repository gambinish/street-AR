import * as React from 'react';
import * as Expo from 'expo';
import { MapView } from 'expo';
import { Constants, WebBrowser, Location, Permissions } from 'expo';
import { Linking, Button, Platform, StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
import { MonoText } from '../components/StyledText';
import GeoPoints from '../data/GeoPoints'
import ScrollScreen from './ScrollScreen'
import { connect } from 'react-redux';
import CardSection from '../components/common/CardSection'

const mapStateToProps = (state) => {
  return {
    artistName: state.artistName,
    homepage: null,
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

class MapScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      markers: [{
        latitude: 21.29679203358388,
        longitude: -157.85667116574777
      }],
      location: {
        latitude: 21.29679203358388,
        longitude: -157.85667116574777,
        coords: {
          latitude: 21.29679203358388,
          longitude: -157.85667116574777,
        }
      }
    };
  }
  
  static navigationOptions = {
    title: 'Map'
  }
  
  // simulate db request
  fetchLocationData = (coordMap) => {
    this.setState({
      isLoading: false,
      markers: coordMap,
    })
  }

  componentDidMount = async () => {
    // LINK TO URL
    Linking.addEventListener('url', this._handleOpenURL);
    
    // PERMISSIONS
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log('MAP CURRENT: ', location)
    this.setState({
      location: location
    });
    this.fetchLocationData(GeoPoints)
    
    this.props.getMuralLocations();
  }

  componentDidUpdate = async (prevProps) => {
    if (prevProps !== this.props) {
      this.props.getMuralLocations();
    }

    // LINK TO URL
    Linking.addEventListener('url', this._handleOpenURL);

    // PERMISSIONS
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    
    console.log('MAP CURRENT: ', location)
    this.setState({
      location: location
    });
    
    this.fetchLocationData(GeoPoints)
  }


  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }

  _handleOpenURL(event) {
    console.log(event.url);
  }

  render() {
    this.state.markers.map((marker) => {
      const coords = {
        latitude: marker.latitude,
        longitude: marker.longitude
      };
    })
    console.log(this.state.markers)
  
    return (
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: 21.29679203358388,
          longitude: -157.85667116574777,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <MapView.Marker
          style={styles.currentLocal}
          pinColor='green'
          coordinate={this.state.location.coords}
          title='Current Location'
        />
        {this.state.isLoading ? null : this.state.markers.map((marker, index) => {
          const coords = {
            latitude: marker.latitude,
            longitude: marker.longitude,
          };
          const id = marker.id
          const name = marker.name
          const description = marker.description
          const wall = marker.wall
          const artist = marker.artist
          const mural = marker.image
  
          return (
            <MapView.Marker
              coordinate={coords}
              key={id}
              title={name}
              description={description}
              wall={wall}
              artist={artist}
              mural={mural}
            >
              <MapView.Callout

                // NAVIGATE TO OTHER SCREEN
                title="Go to Scroll"
                onPress={() => this.props.navigation.navigate('Scroll', { renderOne: true,
                  artistId: marker.id,
                  artistName: marker.name })}

                style={styles.button}
              >
                <View style={styles.bubble}>

                  {/* NAVIGATE TO IMAGE */}
                  <CardSection style={styles.photoBackground} key={marker.id}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Scroll', {
                          renderOne: true,
                          artistId: marker.id,
                          artistName: marker.name
                        })}>
                          <Image style={{ width: 100, height: 100, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }} source={{ uri: `${wall}` }} />
                        </TouchableHighlight>
                      </CardSection>                 
                
                  {/* TEXT IN MAP MARKER BUBBLE */}
                  <Text> {name} </Text>

                </View>
              </MapView.Callout>
            </MapView.Marker>
          )
        })}
      </MapView>
    )
  }

  // LINK TO URL
  _handleOpenWithLinking = () => {
    Linking.openURL(`${wall}`);
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  button: {
    marginVertical: 10,
  },
  bubble: {
    width: 150,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#4da2ab',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 6,
    borderColor: '#007a87',
    borderWidth: 0.5,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);