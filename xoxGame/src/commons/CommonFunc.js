
function isGameScoreless(mathTable) {
    let value = true;
    const copiedTable = [...mathTable];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (copiedTable[i][j] === 0) {
          value = false;
          break;
        }
      }
      if (!value) break;
    } 
    return value;
 }
 
 
 // calculates the columns, rows, crosses sums to check the game if it has finished
function checkForWinner(mathTable) {
    const length = mathTable.length;
    const copiedArray = [...mathTable];
    let sum = 0;

    // check the rows (return 1 for player1) / (return 2 for player2)
    for (let i = 0; i < length; i++) {
    // find sum of the corresponding row
    sum = copiedArray[i].reduce((total, value) => total + value, 0); 
    
    if (sum === 3) { return 1; }
    if (sum === -3) { return -1; }
    }

    // check for the columns
    for (let i = 0; i < length; i++) {
    sum = copiedArray[0][i] + copiedArray[1][i] + copiedArray[2][i];

    if (sum === 3) { return 1; }
    if (sum === -3) { return -1; }
    }

    // check for cross 
    sum = copiedArray[0][0] + copiedArray[1][1] + copiedArray[2][2];
    if (sum === 3) { return 1; }
    if (sum === -3) { return -1; }

    sum = copiedArray[0][2] + copiedArray[1][1] + copiedArray[2][0];
    if (sum === 3) { return 1; }
    if (sum === -3) { return -1; }
    
    return 0;
 }
// uses the return value of checkForWinner to do actions according to value (stop the game / continue)
 export function didSomeoneWin(isGameAlone, finishGame, mathTable, animatedValueCopy, namePlayerOne, namePlayerTwo) {
    const switchObject = {
        "1": true,
        "-1": true,
        "0": false
      };
      let who = checkForWinner(mathTable);
      const result = switchObject[String(who)];
      if (isGameAlone) {
        if (result) { // if someone won the game then find the winner 
            finishGame({
              name: who === 1 ? 'Sen kazandın' : 'Telefon kazandı',
              no: who === 1 ? 1 : 2
            });
            return true;
          } else if (isGameScoreless(mathTable)) {
              finishGame({
                  name: "Berabere",
                  no: 3 // to get the equality symbol on resultModal, we give the no prop. 3
              });
          }
          return false;
      } 
      if (result) { // if someone won the game then find the winner 
        finishGame({
          name: who === 1 ? namePlayerOne : namePlayerTwo,
          no: who === 1 ? 1 : 2
        });
      } else if (isGameScoreless(mathTable)) {
          finishGame({
            name: animatedValueCopy > 0 ? namePlayerTwo : namePlayerOne,
            no: animatedValueCopy > 0 ? 2 : 1
          });
      }
 }
 
