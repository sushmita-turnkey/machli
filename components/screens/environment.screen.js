/*jshint esversion: 6 */
/*jshint esversion: 8 */
//import libraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  AsyncStorage
} from "react-native";

let data = [
  {
    value: "Production"
  },
  {
    value: "Staging"
  },
  {
    value: "Development"
  },
  {
    value: "AIX"
  }
];
// create a component
class EnvironmentScreen extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>
          Change pointing environment for{" "}
          {this.props.navigation.state.params.data.item.display_Name} API
        </Text>
        <FlatList
          style={styles.gridContainer}
          data={data}
          renderItem={item => this.renderItem(item)}
          extraData={this.state}
          numColumns={1}
          keyExtractor={item => item.value}
        />
      </View>
    );
  }
  selectItem = async data => {
    await AsyncStorage.setItem(
      this.props.navigation.state.params.data.item.key_identifier,
      data.item.value
    );
    const { navigation } = this.props;
    navigation.goBack();
    navigation.state.params.onSelect({ changedEnvironment: true });
  };
  renderItem = data => (
    <TouchableOpacity
      style={[styles.list, data.item.selectedClass]}
      onPress={() => this.selectItem(data)}
    >
      <View style={styles.contentPanel}>
        <Text style={styles.apiName}>{data.item.value} Environment</Text>
      </View>
    </TouchableOpacity>
  );
}

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  headerText: {
    fontSize: 25,
    marginTop: 50,
    textAlign: "center"
  },
  gridContainer: {
    marginTop: "10%",
    marginBottom: "5%",
    width: "90%",
    height: "75%",
    marginLeft: "5%",
    marginRight: "5%"
  },
  contentPanel: {
    width: "100%",
    backgroundColor: "#036350",
    height: 70,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2
  },
  apiName: {
    fontSize: 18,
    textAlign: "left",
    marginLeft: 20,
    height: 40,
    marginTop: 15,
    color: "#FFFFFF"
  }
});

//make this component available to the app
export default EnvironmentScreen;
