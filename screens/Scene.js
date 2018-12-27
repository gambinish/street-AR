import React from 'react';
import { AR, Camera, Permissions, Location, Constants } from 'expo';
import ExpoTHREE, { AR as ThreeAR, THREE } from 'expo-three';
import { THREE as VIDEO } from 'three';
import { View as GraphicsView } from 'expo-graphics';
import { connect } from 'react-redux';
import { getMuralLocations } from '../redux/app-redux.js';
import { Platform, View, Text, Button, StyleSheet } from 'react-native';
import { THREEx } from './threex';
import { Stats } from './stats.min.js';
console.disableYellowBox = true;
const haversine = require('haversine');
let mural;

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
  let start = {
    latitude: state.coords.latitude,
    longitude: state.coords.longitude
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
    let distance = haversine(start, end, { unit: 'meter' });
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
    THREE.suppressExpoWarnings(true);
    ThreeAR.suppressWarnings();
    console.log('componentWillMount')
  }

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
    const { navigation } = this.props;
    mural = navigation.getParam('mural', 'NO-MURAL');
    console.log('componentDidMount')
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.startLooking();
      THREE.suppressExpoWarnings(true);
      ThreeAR.suppressWarnings();
      const { navigation } = this.props;
      mural = navigation.getParam('mural', 'NO-MURAL');
      console.log('componentDidUpdate');
    }
  }

  startLooking = async () => {
    await Location.watchPositionAsync({ distanceInterval: 5 }, (data) => {
        this.setState({
          locations: createLocations(this.props.geoPoints, {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
          }),
          location: data
        })
    })
    console.log('startLooking')
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
    console.log('_getLocationAsync')
  }

  render() {
    // console.log('pls render', mural);
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
        >
        <Video
        source={{ uri: 'https://www.youtube.com/watch?v=ApXoWvfEYVU' }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={{ width: 300, height: 300 }}
      />
      </GraphicsView>
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
      antialias: true
    });

    this.scene = new THREE.Scene();
    this.scene.background = new ThreeAR.BackgroundTexture(this.renderer);
    this.camera = new ThreeAR.Camera(width, height, 0.0001, 1000);

    this.scene.add(new THREE.AmbientLight(0xffffff));

    let variables = [];

    //Initial Loading Screen
    setTimeout(() => {
      var url = 'https://www.youtube.com/watch?v=5dbG4wqN0rQ';
      var videoTexture = new THREEx.VideoTexture(url);
      var video	= videoTexture.video
      video.autoplay = true;

      var geometry1	= new THREE.CubeGeometry(1,1,1);
	    var material1	= new THREE.MeshBasicMaterial({
	    map	: videoTexture.texture
	    });
      var mesh	= new THREE.Mesh( geometry1, material1 );
      mesh.position.z = -4;
      // this.scene.add( mesh );

      // var video = document.createElement('video');
      // video.loop = true;
      // video.muted = true;
      // video.src = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      // // video.setAttribute( 'webkit-playsinline', 'webkit-playsinline' );
      // // video.play();

      // var texture = new THREE.VideoTexture( video );
      //     texture.minFilter = THREE.LinearFilter;
      //     texture.magFilter = THREE.LinearFilter;
      //     texture.format = THREE.RGBFormat;

      // var material1   = new THREE.MeshBasicMaterial( { map : texture } );

      // const geometry1 = new THREE.PlaneGeometry( 1, 1, 1 );
      // // var material1 = new THREE.MeshBasicMaterial( { map: texture } );
      // var plane = new THREE.Mesh( geometry1, material1 );
      // plane.position.z = -4;
      // this.scene.add( plane )


      this.state.locations.map(e => {
        //Checking Mural Distance from User
        let closeBy = checkDistance(e, this.state.location, 20);
        let inRange = checkDistance(e, this.state.location, 100);
        //Murals within 20 meters
        if (closeBy.inRange) {
          const geometry = new THREE.ConeGeometry(1,4,5);
          const material = new THREE.MeshPhongMaterial({
            color: 'blue',
          });
          let varname = 'pointer' + e.id;
          window[varname] = new THREE.Mesh(geometry, material);
          window[varname].position.x = e.x;
          window[varname].position.z = e.z;
          window[varname].rotation.z = 3;
          window[varname].position.y = 6;
          this.scene.add(window[varname]);
          variables.push(varname);
        //Murals within 100 meters
        } else if (inRange.inRange && !closeBy.inRange) {
          const geometry = new THREE.ConeGeometry(1,4,5);
          const material = new THREE.MeshPhongMaterial({
            color: 'red',
          });
          let varname = 'pointer' + e.id;
          window[varname] = new THREE.Mesh(geometry, material);
          window[varname].position.x = e.x;
          window[varname].position.z = e.z;
          window[varname].rotation.z = 3;
          window[varname].position.y = 6;
          this.scene.add(window[varname]);
          variables.push(varname);
        }
      })
    }, 1000);

    //Updates Screen every 10 seconds
    setInterval(() => {
      console.log('is this changing', this.state.locations[0]);
      //Removes old mural points
      variables.map(e => {
        this.scene.remove(window[e]);
      })
      variables = [];
        this.state.locations.map(e => {
          let closeBy = checkDistance(e, this.state.location, 20);
          let inRange = checkDistance(e, this.state.location, 100);
          if (closeBy.inRange) {
            const geometry = new THREE.ConeGeometry(1,4,5);
            const material = new THREE.MeshPhongMaterial({
              color: 'blue',
            });
            let varname = 'pointer' + e.id;
            window[varname] = new THREE.Mesh(geometry, material);
            window[varname].position.x = e.x;
            window[varname].position.z = e.z;
            window[varname].rotation.z = 3;
            window[varname].position.y = 6;
            this.scene.add(window[varname]);
            variables.push(varname);
          } else if (inRange.inRange && !closeBy.inRange) {
            const geometry = new THREE.ConeGeometry(1,4,5);
            const material = new THREE.MeshPhongMaterial({
              color: 'red',
            });
            let varname = 'pointer' + e.id;
            window[varname] = new THREE.Mesh(geometry, material);
            window[varname].position.x = e.x;
            window[varname].position.z = e.z;
            window[varname].rotation.z = 3;
            window[varname].position.y = 6;
            this.scene.add(window[varname]);
            variables.push(varname);
          }
        })
    }, 3000);

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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
