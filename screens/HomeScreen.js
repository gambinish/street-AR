import * as React from 'react';
import { Constants, Location, Permissions } from 'expo';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  TextInput,
  Button,
  Animated,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

import { WebBrowser } from 'expo';
import { connect } from 'react-redux';

import { MonoText } from '../components/StyledText';
import { RangaText } from '../components/StyledText';
import { FadeInView } from '../components/HomeAnimation.js';
import CardSection from '../components/common/CardSection'

// REDUX ACTIONS
import { findArtist } from '../redux/app-redux.js';
import { getMuralLocations } from '../redux/app-redux.js';

console.disableYellowBox = true;

// REDUX MAPPING CONFIG
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

class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      results: [],
      editing: true
    }
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.props.getMuralLocations();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.props.getMuralLocations();
    }
  }

  handleChange = text => {
    this.setState({ text, editing: true })
  }

  handleSubmit = event => {
    event.preventDefault();
    // console.log(this.props.geoPoints)
    this.setState({
      results: this.props.geoPoints.filter(x => x.name.toLowerCase().includes(this.state.text.toLowerCase())),
      editing: false
    })
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <FadeInView>
                  <Image
                    source={
                      __DEV__
                        ? require('../assets/images/logo.png')
                        : require('../assets/images/logo.png')
                    }
                    style={styles.welcomeImage} />
                  <RangaText style={{ fontSize: 28, textAlign: 'center', margin: 10 }}>
                    AR
                  </RangaText>
                  {/* SANITY CHECK FOR REDUX STORE CONNECTION */}
                  <Text>{this.props.artistName}</Text>

                  {/* TERNARY TEXT INPUT IOS VS ANDROID */}
                  {/* BREAK THIS INTO HELPER FUNCTION? */}
                  {Platform.OS === 'ios'
                    ?
                    <TextInput name='searchInput' placeholder='enter artwork here' style={{ borderWidth: 1, width: 200, height: 40, textAlign: 'center' }} onChangeText={this.handleChange} value={this.state.text} />
                    :
                    <TextInput
                      placeholder="enter artwork here"
                      style={{ height: 40, borderColor: 'gray', borderWidth: 1, textAlign: "center" }}
                      onChangeText={(text) => {
                        this.setState({ text })
                        this.setState({ artistName: text })
                      }}
                      value={this.state.text}
                    />
                  }
                  <Button title='Find Artwork' onPress={this.handleSubmit} />
                </FadeInView>
              </View>
            </View>
            <View style={styles.scrollStyle}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {this.props.geoPoints.map((data) => {
                  if (data.name.toLowerCase().includes(this.state.text.toLowerCase()) && !this.state.editing) {
                    return (
                      <CardSection style={styles.photoBackground} key={data.id}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Scroll', {
                          artistId: data.id,
                          artistName: data.name
                        })}>
                          <Image style={styles.imageStyle} source={{ uri: data.wall }} />
                        </TouchableHighlight>
                      </CardSection>
                    )
                  }
                })}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    width: 200,
    height: 160,
    resizeMode: 'contain',
    marginTop: '50%',
    marginLeft: -10,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  getStartedText: {
    fontSize: 50,
    paddingTop: '15%',
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  imageStyle: {
    height: 200,
    flex: 1,
    width: 200
  },
  photoBackground: {
    backgroundColor: 'black'
  },
  scrollStyle: {
    height: 200,
    flex: 1,
    width: '100%'
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);