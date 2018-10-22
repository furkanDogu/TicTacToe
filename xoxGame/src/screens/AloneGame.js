import React from 'react';
import { View, Text, Modal } from 'react-native';
import Table from '../components/Table';
import { ResultModal } from '../components/Modals';
import { didSomeoneWin } from '../commons/CommonFunc';

class AloneGame extends React.Component {

    state = {
        mathTable: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        player: 1,
        winner: null,
        resultModalVisible: false
    }
    // this method is passed to the table component. Table component gets the value of math table at a specific point.
    getSquareValue(point) { 
        return this.state.mathTable[point.x][point.y];
    }

    changeModalVisibility(value) {
        this.setState({ resultModalVisible: value }); 
    }
    // this method initializes the table.
    clearTable() {
        const mathTable = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        this.setState({ mathTable });
    }

    clickedToSquare(point) {
        // if the square is clicked before return the function.
        const isClickedBefore = this.state.mathTable[point.x][point.y] !== 0;
        if (isClickedBefore) { return; }
    
        // copy the current mathTable and change it without mutating
        const tempTable = [...this.state.mathTable];
        tempTable[point.x][point.y] = this.state.player;
    
        // change the current player and set the changed values
        this.phoneClicks(tempTable);
    }

    finishGame(winner) {
        this.setState({ winner });
        this.changeModalVisibility(true);
    }
    // This method handles behaviour of phone movements in 'Telefona Karşı Oyna'. 
    phoneClicks(userMathTable) {
        if (!didSomeoneWin(true, this.finishGame.bind(this), [...userMathTable])) {
            const length = userMathTable.length;
            const copiedArray = [...userMathTable];
            let sum = 0;
            let found = false;
            // check the rows if there are 2 or -2.
            for (let i = 0; i < length; i++) {
            // find sum of the corresponding row
            sum = copiedArray[i].reduce((total, value) => total + value, 0);
            if (sum === 2 || sum === -2) {
                copiedArray[i][copiedArray[i].indexOf(0)] = -1;
                found = true;
                break;
            }
            }
            // check columns if there are 2 or -2.
            if (!found) {
                for (let i = 0; i < length; i++) {
                    sum = copiedArray[0][i] + copiedArray[1][i] + copiedArray[2][i];
            
                    if (sum === 2 || sum === -2) {
                        for (let j = 0; j < length; j++) {
                            if (copiedArray[j][i] === 0) {
                                copiedArray[j][i] = -1;
                                found = true;
                                break;
                            }
                        }
                    }
                    if (found) break; 
                }
            }
            // check crosses if there are 2 or -2.
            if (!found) {
                sum = copiedArray[0][0] + copiedArray[1][1] + copiedArray[2][2];
                if (sum === 2 || sum === -2) {
                    copiedArray[0][0] === 0 ? copiedArray[0][0] = -1 : copiedArray[0][0] = copiedArray[0][0];
                    copiedArray[1][1] === 0 ? copiedArray[1][1] = -1 : copiedArray[1][1] = copiedArray[1][1];
                    copiedArray[2][2] === 0 ? copiedArray[2][2] = -1 : copiedArray[2][2] = copiedArray[2][2];
                    found = true;
                }
            } 
            // check crosses if there are 2 or -2.
            if (!found) {
                sum = copiedArray[0][2] + copiedArray[1][1] + copiedArray[2][0];
                if (sum === 2 || sum === -2) {
                    copiedArray[0][2] === 0 ? copiedArray[0][2] = -1 : copiedArray[0][2] = copiedArray[0][2];
                    copiedArray[1][1] === 0 ? copiedArray[1][1] = -1 : copiedArray[1][1] = copiedArray[1][1];
                    copiedArray[2][0] === 0 ? copiedArray[2][0] = -1 : copiedArray[2][0] = copiedArray[2][0];
                    found = true;
                }
            }
            // if everywhere is okay to put find available places and choose random one.
            if (!found) {
                let emptyPlaces = [];
                for (let i = 0; i < length; i++) {
                    for (let j = 0; j < length; j++) {
                        if (copiedArray[i][j] === 0) {
                            emptyPlaces.push({ x: i, y: j });
                        }
                    }
                } 
                if (emptyPlaces.length !== 0) {
                    const cordinate = Math.floor(Math.random() * emptyPlaces.length);
                    copiedArray[emptyPlaces[cordinate].x][emptyPlaces[cordinate].y] = -1;
                }
            }
            
            this.setState({ mathTable: copiedArray }, () => didSomeoneWin(true, this.finishGame.bind(this), [...userMathTable]));
        }
    }
    
    render() {
        const { mainContainerStyle, textStyle } = styles;
            return (
                <View style={mainContainerStyle}>
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
                        changeModalVisibility={this.changeModalVisibility.bind(this)}
                        navigation={this.props.navigation}
                        />
                    </Modal>
                    <Text style={textStyle}>Başlama sırası hep sende</Text>
                    <Table
                     getSquareValue={this.getSquareValue.bind(this)}
                     clickedToSquare={this.clickedToSquare.bind(this)}
                    />
                </View>
            );
    }

} 
    
export default AloneGame;

const styles = {
    mainContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 25

    }
};
