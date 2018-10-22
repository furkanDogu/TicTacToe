import React from 'react';
import { View, StyleSheet, Modal, Easing, Animated, Alert } from 'react-native';
import SocketIOClient from 'socket.io-client';
import RoomCreatorModal from '../components/RoomCreatorModal';
import Table from '../components/Table';
import { didSomeoneWin } from '../commons/CommonFunc';
import { ResultModal } from '../components/Modals';
import { barStyles } from '../commons/CommonStyles';

const { elementStyle, barStyle, innerBar, line } = barStyles;
class NetworkGame extends React.Component {
    constructor() {
        super();
        this.state = {
            roomCreatorVisb: true,
            roomNumber: '',
            joiningRoomNo: '',
            id: '',
            isComponentsVisb: false,
            mathTable: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
            currentPlayerID: null,
            tableValue: null, // can be 1 or -1
            winner: null,
            resultModalVisible: false,
            askedOne: null,
             // if opponent is asking for a new game this player will be the asked one and we will use that state to change resultModal
        };
        this.socket = SocketIOClient('localhost:3000'); // we need to enter here local host http://192.168.xxxx:3000
        this.setRoomNumber = this.setRoomNumber.bind(this);
        this.setJoiningRoomNo = this.setJoiningRoomNo.bind(this);
        this.getSquareValue = this.getSquareValue.bind(this);
        this.clickedToSquare = this.clickedToSquare.bind(this);
        this.clearTable = this.clearTable.bind(this);
        this.changeModalVisibility = this.changeModalVisibility.bind(this);
        this.handshakeDone = this.handshakeDone.bind(this);
        this.restartGame = this.restartGame.bind(this);
        this.animated_value = new Animated.Value(0);
        this.animated_value.addListener(({ value }) => this.animatedValueCopy = value);
    }

    componentDidMount() {
        // Methods in here are listening to the actions which will be emitted from server.

        // will be called when user gets connected to the server and will set the id state.
        this.socket.on('connect', () => {
            this.setState({ id: this.socket.id });
        });
        
        // user listens an action called 'startGame'. 
        // when the action occurs, this function catches it. Then screen hides the roomCreator component, shows game components (table, timebar).
        this.socket.on('startGame', (currentPlayerID) => {
            this.setState({ roomCreatorVisb: false });
            this.setState({ isComponentsVisb: true });
            this.setState({ currentPlayerID });
            if (this.state.currentPlayerID === this.state.id) { // we determine the table value with currentPlayer (initially currentPlayerID is creator of the room.)
                this.setState({ tableValue: 1 }); 
            } else {
                this.setState({ tableValue: -1 });
            }
        });
        // if this action occurs, it means that where is new table data and user need to update the existing table.
        //after updating we need to check if there is a winner.
        this.socket.on('updateTable', (data) => {
            this.setState({ mathTable: data.mathTable }, () => {
                didSomeoneWin(false,
                    this.finishGame.bind(this),
                    [...this.state.mathTable],
                    this.animatedValueCopy,
                    this.state.tableValue === 1 ? 'Sen' : 'Rakip',
                    this.state.tableValue === 1 ? 'Rakip' : 'Sen');
            });
            this.setState({ currentPlayerID: data.currentPlayerID });
        });
        // if opponent is wants to play again, this action will be caught. Then we set askedOne: true to specify message will be shown on screen.
        this.socket.on('wantToPlayAgain', () => {
            this.setState({ askedOne: true });
        });
        //inits the game.
        this.socket.on('initGame', () => {
            this.clearTable();
            this.changeModalVisibility(false);
            this.setState({ askedOne: null });
        });
        
        //everytime this action is caught, it means currentplayer is changed and we need to change the direction of timebar. 
        this.socket.on('barStartsMoving', (direction) => {
            this.moveTheBar(direction * -1); // if it's 1 , it will become -1. If it's -1, it will become 1.
        });

        //stops the animotion in timebar.
        this.socket.on('stopTheBar', () => {
            this.animated_value.stopAnimation();
            this.animated_value.setValue(0);
        });  

        this.socket.on('wrongNumber', () => {
            Alert.alert('Hatalı giriş', 'Girdiğiniz oda numarası geçersiz');
        });
    }

    getSquareValue(point) { 
        return this.state.mathTable[point.x][point.y];
    } 


    setRoomCreatorVisb(roomCreatorVisb) {
        this.setState({ roomCreatorVisb });
    }
    // If the user presses 'Oda yarat' button, this action will be fired then server will create a room with sended room number.
    setRoomNumber(roomNumber) {
        this.setState({ roomNumber }, () => {
            this.socket.emit("createRoom", this.state.roomNumber);
        });
    }
    getDynamicWidth() {
        const width = this.animated_value.interpolate({
            inputRange: [-0.98, 0, 0.98],
            outputRange: [315, 157.5, 0]
        });
        return { width };
    }
    // emits an action when a player enters a room number. Then server adds the user to corresponding room.
    setJoiningRoomNo(joiningRoomNo) {
        this.setState({ joiningRoomNo }, () => {
            if (joiningRoomNo) {
                this.socket.emit('joinRoom', this.state.joiningRoomNo);
            }
        });
    }

    // to stop both players bars we need to emit an event here.
    finishGame(winner) {
        this.setState({ winner });
        this.changeModalVisibility(true);

        this.socket.emit('stopTheBar', {
            roomNumber: this.state.roomNumber || this.state.joiningRoomNo
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

    clickedToSquare(point) {
        if (this.state.id === this.state.currentPlayerID) {
            // if the square is clicked before return the function.
            const isClickedBefore = this.state.mathTable[point.x][point.y] !== 0;
            if (isClickedBefore) { return; }
        
            // copy the current mathTable and change it without mutating
            const tempTable = [...this.state.mathTable];
            tempTable[point.x][point.y] = this.state.tableValue;
        
            // change the current player and set the changed values
            this.socket.emit('clickedTable', {
                mathTable: [...tempTable],
                roomNumber: this.state.roomNumber || this.state.joiningRoomNo, // determine the room number if user joins a room it will be joining number.
            });
            this.socket.emit('moveTheBar', {
                tableValue: this.state.tableValue,
                roomNumber: this.state.roomNumber || this.state.joiningRoomNo
            });
        }
    }

    clearTable() {
        const mathTable = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.setState({ mathTable });
    }

    changeModalVisibility(value) {
        this.setState({ resultModalVisible: value }); 
    }

    // this function will be called for the first player who presses to "yeniden oyna"
    restartGame() {
        this.setState({ askedOne: false });
        const roomNumber = this.state.roomNumber || this.state.joiningRoomNo;
        this.socket.emit('clickedRestart', roomNumber);
    }

    // this function will be called when the asked player for new game presses "yeniden oyna".
    handshakeDone() {
        const roomNumber = this.state.roomNumber || this.state.joiningRoomNo;
        this.socket.emit('handshakeDone', roomNumber);
    }
    
    // function renders the table component if the server emits gamestart 
    renderTable() {
        if (this.state.isComponentsVisb) {
            return (
                <Table
                clickedToSquare={this.clickedToSquare}
                getSquareValue={this.getSquareValue}
                />
            );
        }
    }

    // function renders the bar component if the server emits gamestart
    renderBar() {
        if (this.state.isComponentsVisb) {
            return (
                <View style={[elementStyle, { marginTop: 50 }]}>
                    <View style={barStyles.containerStyle}>
                        <View style={[barStyle, { backgroundColor: 'green' }]}>
                            <Animated.View 
                                style={[barStyle, innerBar, this.getDynamicWidth()]} 
                            />
                            <View style={line} />
                        </View>
                    </View>
                </View>
            );
        }
    }

    render() {
        const { containerStyle } = styles;
        return (
            <View style={containerStyle}>
                <Modal
                animationType="none"
                transparent
                visible={this.state.roomCreatorVisb}
                onRequestClose={() => {
                this.setRoomCreatorVisb(false);
                }}
                >
                    <RoomCreatorModal
                    setJoiningRoomNo={this.setJoiningRoomNo}
                    setRoomNumber={this.setRoomNumber}
                    />
                </Modal>
                <Modal
                animationType="none"
                transparent
                visible={this.state.resultModalVisible}
                onRequestClose={() => {
                    this.changeModalVisibility(false);
                }}
                >
                    <ResultModal
                    handshakeDone={this.handshakeDone}
                    askedOne={this.state.askedOne}
                    restartGame={this.restartGame}
                    winner={this.state.winner}
                    clearTable={this.clearTable.bind(this)}
                    changeModalVisibility={this.changeModalVisibility}
                    navigation={this.props.navigation}
                    />
                </Modal>
                {this.renderTable()}
                {this.renderBar()}
            </View>
        );
    }
}
//
const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default NetworkGame;
