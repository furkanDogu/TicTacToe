import React, { Component } from 'react';
import { View, StyleSheet, Modal, Animated, Easing, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import Table from '../components/Table';
import { ResultModal } from '../components/Modals';
import { didSomeoneWin } from '../commons/CommonFunc';
import { barStyles } from '../commons/CommonStyles';

const { elementStyle, containerStyle, barStyle, innerBar, line } = barStyles;

class FriendGame extends Component {
  constructor(props) {
    super(props);
    this.clearNames = this.props.navigation.getParam('clearNames', 'No-function');
    this.namePlayerOne = this.props.navigation.getParam('namePlayerOne', 'No-name');
    this.namePlayerTwo = this.props.navigation.getParam('namePlayerTwo', 'No-name');
    this.clickedToSquare = this.clickedToSquare.bind(this);
    this.getSquareValue = this.getSquareValue.bind(this);
    this.changeModalVisibility = this.changeModalVisibility.bind(this);
    this.state = {
      mathTable: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      currentPlayer: 1,
      resultModalVisible: false,
      winner: null
    };
    this.animated_value = new Animated.Value(0);
    this.animated_value.addListener(({ value }) => this.animatedValueCopy = value);
  }
  // gets called when component is taken out of screen.
  componentWillUnmount() {
    this.clearNames(); // clearing the names in parent state.
  }
  // returns current value of the square to be used by table component for rendering.
  getSquareValue(point) { 
    return this.state.mathTable[point.x][point.y];
  }

  getDynamicWidth() {
    const width = this.animated_value.interpolate({
        inputRange: [-0.98, 0, 0.98],
        outputRange: [315, 157.5, 0]
    });
    return { width };
  }

  // clears the game table and brings the modal to scene.
  finishGame(winner) {
    this.setState({ winner });
    this.changeModalVisibility(true);
    this.animated_value.stopAnimation();
    this.animated_value.setValue(0);
  }
  // changes modal visibilty
  changeModalVisibility(value) {
    this.setState({ resultModalVisible: value }); 
  }

  // this method is given to table component to detect clicked squre.
  clickedToSquare(point) {
    // if the square is clicked before return the function.
    const isClickedBefore = this.state.mathTable[point.x][point.y] !== 0;
    if (isClickedBefore) { return; }

    // copy the current mathTable and change it without mutating
    const tempTable = [...this.state.mathTable];
    tempTable[point.x][point.y] = this.state.currentPlayer;

    // change the current player and set the changed values
    this.setState({ mathTable: tempTable, currentPlayer: this.state.currentPlayer === 1 ? -1 : 1 },
       () => {
         this.moveTheBar(this.state.currentPlayer);
         didSomeoneWin(false,
          this.finishGame.bind(this),
          [...tempTable],
          this.animatedValueCopy,
          this.namePlayerOne,
          this.namePlayerTwo);
      });
  }

  moveTheBar(direction) {
    this.animated_value.stopAnimation();
    Animated.timing(this.animated_value, {
        toValue: direction,
        duration: 2500,
        easing: Easing.linear
    }).start(() => {
      if (this.animatedValueCopy === -1 || this.animatedValueCopy === 1) {
          this.finishGame({
          name: this.animatedValueCopy > 0 ? this.namePlayerTwo : this.namePlayerOne,
          no: this.animatedValueCopy > 0 ? 2 : 1
        });
      }
    });
  }
  
  // clears the table in case users want to play one more round.
  clearTable() {
    const mathTable = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.setState({ mathTable });
  }
  
  bringWinnerIcon = () => {
      const iconName = this.state.currentPlayer === 1 ? 'play' : 'pause';
      const iconColor = this.state.currentPlayer === 1 ? 'green' : 'red';
      return <Icon type="font-awesome" size={60} name={iconName} color={iconColor} />;
  };
  render() {
      return (
          <View style={styles.mainContainerStyle}>
              <Modal
              animationType="none"
              transparent
              visible={this.state.resultModalVisible}
              onRequestClose={() => {
                this.changeModalVisibility(false);
              }}
              >
              <ResultModal
              winner={this.state.winner}
              clearTable={this.clearTable.bind(this)}
              changeModalVisibility={this.changeModalVisibility}
              navigation={this.props.navigation}
              />
              </Modal>

              <View style={styles.next}>
                <Text style={{ marginRight: 20 }}>Sıradaki :</Text>
                {this.bringWinnerIcon()}
              </View>
              
            <View style={styles.elementStyle}>
              <Table
                clickedToSquare={this.clickedToSquare}
                getSquareValue={this.getSquareValue}
              />
            </View>
            <View style={[elementStyle, { marginTop: 50 }]}>
              <View style={containerStyle}>
                  <View style={[barStyle, { backgroundColor: 'green' }]}>
                      <Animated.View 
                          style={[barStyle, innerBar, this.getDynamicWidth()]} 
                      />
                      <View style={line} />
                  </View>
              </View>
            </View>
          </View>
        
      );
  } 
}
const styles = StyleSheet.create({
  mainContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  next: {
    width: 170,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  }
  
});

export default FriendGame;
