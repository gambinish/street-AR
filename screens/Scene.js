import React from 'react';
import { AR, Camera, Permissions, Location, Constants } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
import { View as GraphicsView } from 'expo-graphics';
// import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { getMuralLocations } from '../redux/app-redux.js';
import { Platform, View, Text, Button, StyleSheet } from 'react-native';
// import tourspots from '../data/GeoPoints';
console.disableYellowBox = true;
const haversine = require('haversine');


const mapStateToProps = (state) => {
  return {
    id: state.id,
    artistName: state.artistName,
    geoPoints: state.geoPoints,
    selectedLibrary: state.selectedLibrary,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    findArtist: (text) => {
      dispatch(findArtist(text))
    },
    getMuralLocations: () => {
      dispatch(getMuralLocations())
    },
  }
}

const _latLongToMerc = (lat_deg, lon_deg) => {
  // Mercator projection is a cylindrical map projection
  let lon_rad = (lon_deg / 180.0 * Math.PI)
  // (longitude radius / 180.0 * 3.14)
  let lat_rad = (lat_deg / 180.0 * Math.PI)
  // (latitude radius / 180.0 * 3.14)
  let sm_a = 6378137.0 // Earth Radius
  let xmeters = sm_a * lon_rad;
  // earth radius * lon_rad
  let ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad))
  return ({ x: xmeters, y: ymeters });
}

const transformPointToAR = (lat, long, deviceLatitude, deviceLongitude) => {
  let objPoint = _latLongToMerc(lat, long);
  let devicePoint = _latLongToMerc(deviceLatitude, deviceLongitude);
  let objFinalPosZ = objPoint.y - devicePoint.y;
  let objFinalPosX = objPoint.x - devicePoint.x;
  return ({ x: objFinalPosX, z: -objFinalPosZ });
}

const checkDistance = (e, state, n) => {
  // console.log('why u no werk', state)
  let start = {
    latitude: state._55.coords.latitude,
    longitude: state._55.coords.longitude
  }

  let end = {
    latitude: e.latitude,
    longitude: e.longitude
  }

  let x = haversine(start, end, { unit: 'meter' })

  if (x <= n) {
    return {
      inRange: true,
      distance: x
    };
  } else {
    return {
      inRange: false
    }
  }
}

const findClosest = (start, places) => {
  let closest = 100;
  let location;
  places.map(e => {
    let end = {
      latitude: e.latitude,
      longitude: e.longitude
    };
    let distance = haversine(start, end, { unit: 'mile' });
    if (distance < closest) {
      closest = distance;
      location = e.name;
    }
  });
  return location;
};

const createLocations = (locations, device) => {
  let locales = [];
  let poi;
  locations.map(e => {
    let lat = e.latitude;
    let lon = e.longitude;
    poi = {
      id: e.id,
      latitude: Number(lat),
      longitude: Number(lon),
      tourspot: findClosest({
        latitude: Number(lat),
        longitude: Number(lon)
      }, locations),
      color: 'green',
      x: transformPointToAR(lat, lon, device.latitude, device.longitude).x,
      z: transformPointToAR(lat, lon, device.latitude, device.longitude).z
    }
    locales.push(poi);
  })
  return locales;
}


class App extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        type: Camera.Constants.Type.back,
        location: null,
        errorMessage: null,
        locations: [],
        test: 0,
      }
  }

  static navigatingOptions = {
    header: null,
  };

  async componentDidMount() {
    let location = await Location.getCurrentPositionAsync({})
    this.setState({
      locations: createLocations(this.props.geoPoints, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }),
    })
    this.startLooking();
    THREE.suppressExpoWarnings(true);
    ThreeAR.suppressWarnings();
    // console.log('1', this.state.location)
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      let location = Location.getCurrentPositionAsync({})
      this.setState({
        locations: createLocations(this.props.geoPoints, {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }),
        // location: createLocations(this.props.geoPoints, {
        //   latitude: location.coords.latitude,
        //   longitude: location.coords.longitude
        // }),
        location: this._getLocationAsync()
      })
      this.startLooking();
      THREE.suppressExpoWarnings(true);
      ThreeAR.suppressWarnings();
    }
    // console.log('2', this.state.location)
  }

  startLooking = async () => {
    await Location.watchPositionAsync({ distanceInterval: 10 }, (data) => {
      console.log('watching');
      let location = Location.getCurrentPositionAsync({});
      this.setState({ location });
      this.setState({
        locations: createLocations(this.props.geoPoints, {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude
        }),
      })
    })
    // console.log('3', this.state.location)
  }


  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!'
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied'
      })
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    this.setState({
      locations: createLocations(this.props.geoPoints, {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    })
    // console.log('5', this.state.location)
  }

  render() {
    if (Platform.OS === 'android') {
      return (
        <View style={styles.container}>
          <Text style={styles.headerText}>NOT COMPATIBLE WITH ANDROID</Text>
          <Button
            title="Go to Home"
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </View>
      )
    }
    else {
      return (
        <GraphicsView
          style={{ flex: 1 }}
          onContextCreate={this.onContextCreate}
          onRender={this.onRender}
          onResize={this.onResize}
          isArEnabled
          isArRunningStateEnabled
          isArCameraStateEnabled
          arTrackingConfiguration={AR.TrackingConfigurations.World}
        />
      )
    };
  }

  onContextCreate = async ({ gl, scale: pixelRatio, width, height }) => {
    // This will allow ARKit to collect Horizontal surfaces
    AR.setPlaneDetection(AR.PlaneDetectionTypes.Horizontal);
    const WorldAlignmentTypes = {
      Gravity: 'gravity',
      GravityAndHeading: 'gravityAndHeading',
      AlignmentCamera: 'alignmentCamera',
    };

    AR.setWorldAlignment(WorldAlignmentTypes.GravityAndHeading)

    // Create a 3D renderer
    this.renderer = new ExpoTHREE.Renderer({
      gl,
      pixelRatio,
      width,
      height,
    });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.camera = new ThreeAR.Camera(width, height, 0.0001, 1000);

    this.scene.add(new THREE.AmbientLight(0xffffff));
    
    let variables = [];
    setTimeout(() => {
      this.state.locations.map(e => {
        let closeBy = checkDistance(e, this.state.location, 20);
        let inRange = checkDistance(e, this.state.location, 100);
        if (closeBy.inRange) {
          const geometry = new THREE.ConeGeometry((1/20)*closeBy.distance, (4/20)*closeBy.distance, (5/20)*closeBy.distance);
          const material = new THREE.MeshPhongMaterial({
            color: 'blue',
          });
          let varname = 'pointer' + e.id;
          window[varname] = new THREE.Mesh(geometry, material);
          window[varname].position.x = e.x;
          window[varname].position.z = e.z;
          window[varname].rotation.z = 3;
          window[varname].position.y = 10;
          this.scene.add(window[varname]);
          variables.push(varname);
        } else if (inRange.inRange && !closeBy.inRange) {
          const geometry = new THREE.ConeGeometry((1/20)*inRange.distance, (4/20)*inRange.distance, (5/20)*inRange.distance);
          const material = new THREE.MeshPhongMaterial({
            color: 'red',
          });
          let varname = 'pointer' + e.id;
          window[varname] = new THREE.Mesh(geometry, material);
          window[varname].position.x = e.x;
          window[varname].position.z = e.z;
          window[varname].rotation.z = 3;
          window[varname].position.y = 10;
          this.scene.add(window[varname]);
          variables.push(varname);
        }
      })
    }, 1000);
    
    setInterval(() => {
      variables.map(e => {
        this.scene.remove(window[e]);
      })
      variables = [];
      this.state.locations.map(e => {
        console.log('my location', this.state.location._55.coords.latitude, this.state.location._55.coords.longitude);
        console.log('a;sldkfja;', e.tourspot, e.x, e.z);
        let closeBy = checkDistance(e, this.state.location, 20);
        let inRange = checkDistance(e, this.state.location, 100);
        if (closeBy.inRange) {
          const geometry = new THREE.ConeGeometry((1/20)*closeBy.distance, (4/20)*closeBy.distance, (5/20)*closeBy.distance);
          const material = new THREE.MeshPhongMaterial({
            color: 'blue',
          });
          let varname = 'pointer' + e.id;
          window[varname] = new THREE.Mesh(geometry, material);
          window[varname].position.x = e.x;
          window[varname].position.z = e.z;
          window[varname].rotation.z = 3;
          window[varname].position.y = 10;
          this.scene.add(window[varname]);
          variables.push(varname);
        } else if (inRange.inRange && !closeBy.inRange) {
          const geometry = new THREE.ConeGeometry((1/20)*inRange.distance, (4/20)*inRange.distance, (5/20)*inRange.distance);
          const material = new THREE.MeshPhongMaterial({
            color: 'red',
          });
          let varname = 'pointer' + e.id;
          window[varname] = new THREE.Mesh(geometry, material);
          window[varname].position.x = e.x;
          window[varname].position.z = e.z;
          window[varname].rotation.z = 3;
          window[varname].position.y = 10;
          this.scene.add(window[varname]);
          variables.push(varname);
        }
      })
    }, 10000);

  };

  // When the phone rotates, or the view changes size, this method will be called.
  onResize = ({ x, y, scale, width, height }) => {
    // Let's stop the function if we haven't setup our scene yet
    if (!this.renderer) {
      return;
    }
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(scale);
    this.renderer.setSize(width, height);
  };

  // Called every frame.
  onRender = () => {
    this.renderer.render(this.scene, this.camera);
  };

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
// }


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
  headerText: {
    fontSize: 18
  },
})
