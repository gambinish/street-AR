import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Button,
  Text,
  LayoutAnimation,
  Platform
} from 'react-native';

import { RangaText } from '../components/StyledText';

import { Header } from '../components/common/Header'
import CardSection from '../components/common/CardSection'
import Card from '../components/common/Card'

// REDUX MAPPING CONFIG
import { connect } from 'react-redux';
import { expandDetail } from '../redux/app-redux.js'

const mapStateToProps = (state) => {
  return {
    id: state.id,
    artistName: state.artistName,
    geoPoints: state.geoPoints,
    selectedLibrary: state.selectedLibrary
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    findArtist: (text) => {
      dispatch(findArtist(text))
    },
    getMuralLocations: () => {
      dispatch(getMuralLocations())
    },
    expandDetail: (data) => {
      dispatch(expandDetail(data))
    }
  };
}


class ScrollScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
      screenWidth: Dimensions.get('window').width
    }
  }

  componentDidMount() {
    this.scrollAuto();
  }

  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.scrollAuto();
    }
  }

  renderDescription(profileId, profileDescription) {
    if (profileId === this.props.selectedLibrary) {
      return (
        <CardSection>
          <Text>
            {profileDescription}
          </Text>
        </CardSection>
      )
    }
  }

  renderButtons(profileId) {
    if (profileId === 1) {
      return (
        <View>
          <CardSection>
            <Button title='Next Mural' onPress={() => this.scrollDown(profileId)} />
          </CardSection>
        </View>
      )
    } else if (profileId === this.props.geoPoints.length) {
      return (
        <View>
          <CardSection>
            <Button title='Previous Mural' onPress={() => this.scrollUp(profileId)} />
          </CardSection>
          <CardSection>
            <Button title='Scroll to Top' onPress={() => this.scrollToTop()} />
          </CardSection>
        </View>
      )
    } else {
      return (
        <View>
          <CardSection>
            <Button title='Previous Mural' onPress={() => this.scrollUp(profileId)} />
            <Button title='Next Mural' onPress={() => this.scrollDown(profileId)} />
          </CardSection>
          <CardSection>
            <Button title='Scroll to Top' onPress={() => this.scrollToTop()} />
          </CardSection>
        </View>
      )
    }
  }

  goToAR(profile) {
    return (
      <CardSection>
        <Button title='Find Mural' onPress={() => this.props.navigation.navigate('Scene', {
          mural: profile
        })} />
      </CardSection>
    )
  }

  scrollAuto = () => {
    let { navigation } = this.props;
    let id = navigation.getParam('artistId');
    if (id !== 'NO-ID') {
      let scrollYPos = this.state.screenHeight * (id - 1);
      this.scroller.scrollTo({ x: 0, y: scrollYPos, animated: true })
    }
  }

  onClick = (clickId) => {
    // fire action to toggle description
    this.props.expandDetail(clickId)
  }

  scrollUp = (num) => {
    let scrollYPos = this.state.screenHeight * (num - 2);
    this.scroller.scrollTo({ x: 0, y: scrollYPos, animated: true })
  }

  scrollDown = (num) => {
    let scrollYPos = this.state.screenHeight * (num);
    this.scroller.scrollTo({ x: 0, y: scrollYPos, animated: true })
  }

  scrollToTop = () => {
    this.scroller.scrollTo({ x: 0, y: 0, animated: true })
  }

  render() {
    // const { navigation } = this.props;
    // const artistId = navigation.getParam('artistId', 'NO-ID');
    // const artistName = navigation.getParam('artistName', 'NO-NAME');

    return (
      <ScrollView ref={(scroller) => { this.scroller = scroller }}>
        {/* <Text>{artistId}, {artistName}</Text> */}
        {this.props.geoPoints.map((profile) => {
          return (
            <View key={profile.id} style={styles.screen}>
              <Card id={profile.id}>
                {/* Beginning of Card Header */}
                <CardSection>
                  <View>
                    <Image style={styles.thumbnailStyle} source={{ uri: profile.pic }} />
                  </View>
                  <View style={styles.headerContentStyle}>
                    <RangaText style={styles.headerTextStyle}>
                      {profile.name}
                    </RangaText>
                    <RangaText>
                      {profile.region}
                    </RangaText>
                  </View>
                </CardSection>
                {/* Beginning of Card Image */}
                <CardSection style={styles.photoBackground}>
                  <Image style={styles.imageStyle} source={{ uri: profile.wall }} />
                </CardSection>
                <CardSection>
                  <Button title='View Description' onPress={() => this.onClick(profile.id)} />
                </CardSection>
                {this.renderDescription(profile.id, profile.description)}
                {this.renderButtons(profile.id)}
                {/* {this.goToAR(profile)} */}
              </Card>
            </View>
          )
        })}
      </ScrollView>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScrollScreen);

const styles = StyleSheet.create({
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 8
  },
  headerTextStyle: {
    fontSize: 18
  },
  photoBackground: {
    backgroundColor: 'black'
  },
  thumbnailStyle: {
    height: 50,
    width: 50,
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  },
  image: {
    alignItems: 'center',
    marginLeft: '5%',
    marginTop: '2%',
    width: '90%',
    height: 150
  },
  screen: {
    height: Dimensions.get('window').height
  }
});