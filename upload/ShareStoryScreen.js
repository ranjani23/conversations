import React, { Component } from 'react';
import { Text, View , StyleSheet, Dimensions, PixelRatio, ImageBackground, FlatList, TouchableNativeFeedback, TouchableHighlight, Button, AsyncStorage} from 'react-native';
import styles , {P,H2,HR, H3, H4, HMedium} from ".././page/styles.js";
import {getLocalizedString} from ".././Languages/LanguageChooser";
import { createStackNavigator } from 'react-navigation';
import UploadVideoScreen from './UploadVideoScreen.js';
import UploadProgress from './UploadProgress.js';
import UploadedFilesList from "./UploadedFilesList.js";

const bottomScrollerMarginFactor = 0.18;

export class ShareStoryScreen extends Component {

    constructor (props) {
      super(props);
      this.state = {
        uploadedVideos: []
      }
      this._onStart = this._onStart.bind(this);
      this._onViewUploaded = this._onViewUploaded.bind(this);
    }

    componentDidMount () {
      this.getUploadedVideos().then(videos => this.setState({'uploadedVideos': videos}));
    }

    _onStart (event) {
        this.props.navigation.navigate('UploadVideo');
    }

    async getUploadedVideos() {
        var videos = await AsyncStorage.getItem("Aashiyaan:uploaded");
        if (videos) {
            videos = JSON.parse(videos);
            return Object.keys(videos).map(k => videos[k]);
        } else {
            return [];
        }
    }

    _onViewUploaded (event) {
        console.debug("REACHED HERE");
        this.props.navigation.navigate('UploadedFiles', {uploadedVideos: this.state.uploadedVideos});
    }

    render () {
      const width = Dimensions.get('window').width;
      const height = Dimensions.get('window').height;
      let homeScreenImage = require('.././assets/BackgroundForAppLanding.png');
      let viewUploadedDisabled = this.state.uploadedVideos.length <1;
      let uploadedViewColor = viewUploadedDisabled ? 'rgba(43,35,103,0.5)' : 'rgb(43,35,103)';

      return (
        <ImageBackground
            source={ homeScreenImage }
            imageStyle={{resizeMode: 'cover'}}
            style={{width: width, height: height}}
        >
          <View
            style={{ backgroundColor: "white", width: width*0.9, height: height, marginLeft: width*0.05, marginBottom: height*bottomScrollerMarginFactor}} >
            <View>
                <HMedium> <Text style ={mystyles.shareStoryTitle}> Share Your Story </Text> </HMedium>
            </View>
            <View>
                <H4>
                  <Text>
                     The women of Aashiyaan shared their strategies to stay safe. {"\n"}
                        Share YOUR strategy !
                  </Text>
                </H4>
                <H3>
                  <Text style={mystyles.storyCreate}>
                    Create a story
                 </Text>
               </H3>
             </View>
             <View style={{height:100}}>
             <FlatList
                data={[{key: 'Record a video with your device'},
                       {key: 'Submit one story or strategy per video.'},
                       {key: 'Keep clips short. We recommend less than 2 minutes.'},
                       {key: 'Your story may be added to Aashiyaan!'}]}
               renderItem={({item}) => <Text style={mystyles.instructions}>{item.key}</Text>}> </FlatList>
             </View>
               <View style={{flex:1, flexDirection: 'row', justifyContent: 'center'}}>
                 <TouchableHighlight
                     onPress={this._onStart}
                     background={TouchableNativeFeedback.SelectableBackground()}>
                   <View style={{height:30, width:130, backgroundColor: 'rgb(43,35,103)',margin:20}}>
                     <Text style={{color: 'white', textAlign:'center'}}>START</Text>
                   </View>
                 </TouchableHighlight>
                 <TouchableHighlight
                     onPress={this._onViewUploaded}
                     disabled={viewUploadedDisabled}
                     background={TouchableNativeFeedback.SelectableBackground()}>
                   <View style={{height:30, width:130, backgroundColor: uploadedViewColor, margin:20}}>
                     <Text style={{color: 'white', textAlign: 'center'}}>VIEW UPLOADED</Text>
                   </View>
                 </TouchableHighlight>
               </View>
         </View>
      </ImageBackground>

      );
    }
}


const UploadStack = createStackNavigator({
    ShareStory: {
      screen: ShareStoryScreen
    },
    UploadVideo: {
      screen: UploadVideoScreen
    },
    UploadProgress: {
      screen: UploadProgress
    },
    UploadedFiles: {
      screen: UploadedFilesList
    }
}, {
    initialRouteName: 'ShareStory',
    headerMode: 'none',
    headerBackTitleVisible: false,
});

export default class upload extends React.Component {
  render() {
    return (
      <UploadStack />
    )
  }
}

const mystyles = StyleSheet.create({
   shareStoryTitle: {
     color: 'rgb(43, 35, 103)'

   },
   instructions: {
     color: 'rgb(43,35,103)',
     fontSize: 15,
     paddingLeft: 50
   },
   storyCreate: {
     paddingLeft: 20
   }
});
