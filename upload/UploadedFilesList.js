import React from 'react';
import { View, Text, StyleSheet, TextInput, CheckBox, AsyncStorage, FlatList} from 'react-native';
import firebase from "react-native-firebase";
import { Button } from "../component/Button.js";
import { H2, P, Strong } from "../page/styles.js";


function formatDate(when) {
    if (!when) return "????/??/??";

    if (typeof when === "string" || typeof when === "number")
        when = new Date(when);
     const formattedMonth = when.getMonth()+1;
    return [when.getFullYear(), formattedMonth, when.getDate()].join("/");
}

export default class UploadedFilesList extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this.state = {
      uploadedVideos: navigation.getParam('uploadedVideos', [])
    }
    this.onDelete = this.onDelete.bind(this);
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

  onDelete = (video) => {
      let {name, date} = video;
      firebase.firestore().collection("deletionRequests").add({
          videoName: name,
          videoDate: date
      }).then(_ => {
          video.deletionRequested = true;
          return this.saveVideoInfo(video);
      }).then(videos => this.setState({ uploadedVideos: videos }));
  }

  saveVideoInfo(video) {
      var date = video.date || new Date().toISOString();
      if (typeof date !== "string")
          date = date.toISOString();

      return AsyncStorage.mergeItem("Aashiyaan:uploaded",
                                    JSON.stringify({
                                        [date]: video
                                    }))
                         .then(() => this.getUploadedVideos());
  }

  render () {
    let videos = this.state.uploadedVideos || [];
    return (
      <FlatList
          contentContainerStyle={{justifyContent: "center"}}
          data={videos}

          renderItem={({item, index}) => (
              <View style={styles.uploadedItem} key={item.date}>
                  <Text>
                      <Strong>{item.name}</Strong>{"\n"}
                        Uploaded {formatDate(item.date)}
                  </Text>
                  <Button buttonStyle={{ backgroundColor: "red", color: "white"}}
                        style={{alignSelf: "flex-end"}}
                        onPress={() => this.onDelete(item)}
                        disabled={item.deletionRequested} >
                        {item.deletionRequested ? "Deletion Requested" : "Delete"}
                  </Button>

              </View>
          )}
      />
      )
    }
  }

  const styles = StyleSheet.create({
      uploadedItem: {
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "80%"
      }
  });
