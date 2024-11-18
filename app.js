const mainBoard = document.querySelector("#chessBoard");
const playerName = document.querySelector("#player");
const infoDisplay = document.querySelector("#info");
const width = 8;
let playerGo = "black"
playerName.textContent="black"

const eachCell = [rook, knight,bishop,queen,king,bishop,knight,rook,
                  pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
                  "","","","","","","","",
                  "","","","","","","","",
                  "","","","","","","","",
                  "","","","","","","","",
                  pawn,pawn,pawn,pawn,pawn,pawn,pawn,pawn,
                  rook, knight,bishop,queen,king,bishop,knight,rook
];

function createBoard() {
  eachCell.forEach((startPiece, index) => {
    const square = document.createElement("div");
    square.classList.add("square");

    // Alternate colors based on the index
    //(index/8) gives the row number
    if (Math.floor(index / 8) % 2 === 0) {
      //if the row is even then it adds green color
      square.classList.add(index % 2 === 0 ? "green" : "light");
    } else {
      square.classList.add(index % 2 === 0 ? "light" : "green");
    }
    square.setAttribute("square-id",index)

    //adds the inner html of pieces ,if present
    if (startPiece) {
      square.innerHTML = startPiece;
      square.setAttribute("square-id", index);
      if (index < 16) {
        square.firstChild.classList.add("black");
      } else if (index >= 48) {
        square.firstChild.classList.add("beige");
      }
    }
    square.firstChild?.setAttribute("draggable", true); //to make the pieces draggable

    mainBoard.append(square);
  });
}
createBoard();

const allSquare = document.querySelectorAll(".square");
allSquare.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  square.addEventListener("drop", dragDrop);
});

let startPositionId;
let draggedElement;
function dragStart(e) {
  draggedElement = e.target;
  startPositionId = e.target.parentNode.getAttribute("square-id");
}

function dragOver(e) {
  e.preventDefault();
}


//Drag and Drop Functionality
function dragDrop(e) {
  e.stopPropagation();

  const correct = draggedElement.classList.contains(playerGo);

  let targetSquare = e.target;

  if (!targetSquare.classList.contains("square")) {
    targetSquare = targetSquare.closest(".square"); // Get the parent square if a piece is targeted
  }

  const opponent = playerGo === "beige" ? "black" : "beige";
  const first_Child = targetSquare.firstChild; // Safely get firstChild only if it's a square

  // console.log("opponent:", opponent);
  
  const taken = first_Child !== null; // true if there's a piece in the square
  const valid = checkIfValid(targetSquare,opponent);
  const takenByOpponent = taken && first_Child.classList.contains(opponent);
  

//   console.log("Correct:", correct);
//   console.log("Taken:", taken);
  // console.log("Taken by Opponent:", takenByOpponent);
  // console.log("Valid:",valid);
  

  if (correct) {
    //if taken by the opponent and a valid move
    if (takenByOpponent && valid) {
      console.log("Capturing opponent's piece");
      targetSquare.removeChild(first_Child);
      targetSquare.appendChild(draggedElement);
      checkForWin();
      changePlayer();
      return;
    }


    //for valid move
    if (valid && !taken) {
      // console.log("Moving to empty square");
      
      targetSquare.appendChild(draggedElement)
      checkForWin();
      changePlayer();
    }else{ // for invalid move
      infoDisplay.textContent = "Invalid Move! ";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
    }
  }
}

function checkIfValid(target,opponent){
    let targetId= Number(target.getAttribute("square-id"))
    // if(targetId===null) targetId=Number(target.parentNode.parentNode.getAttribute("square-id"))
    let startId= Number(startPositionId)
    let piece= draggedElement.id
    // console.log("targetID:",targetId);
    // console.log("startId:",startId);
    // console.log("piece:",piece);
    // console.log("draggedElement:",draggedElement);
    // console.log(`[square-id="${startId+width-1}"]`);
    
    
    switch(piece){
      case 'pawn':
        const starterRow=[8,9,10,11,12,13,14,15]
        //move from starting position to empty squares
        const leftDiagonal = document.querySelector(`[square-id="${startId + width - 1}"]`);
        const rightDiagonal = document.querySelector(`[square-id="${startId + width + 1}"]`);
        if (
          (starterRow.includes(startId) &&(startId + width * 2 === targetId || startId + width === targetId)) ||
          startId + width === targetId ||
          (startId + width - 1 === targetId && leftDiagonal && leftDiagonal.firstChild && leftDiagonal.firstChild.classList.contains(opponent)) ||
          (startId + width + 1 === targetId && rightDiagonal && rightDiagonal.firstChild && rightDiagonal.firstChild.classList.contains(opponent))
        ){
          return true;
        }
        break;

      case 'knight':
        if(
          startId + width * 2+1 ===targetId ||
          startId + width * 2-1 ===targetId ||
          startId + width + 2 ===targetId ||
          startId + width - 2 ===targetId ||
          startId - width * 2+1 ===targetId ||
          startId - width * 2-1 ===targetId ||
          startId - width + 2 ===targetId ||
          startId - width - 2 ===targetId 

        ){
          return true;
        }
        break;

      case 'bishop':
        if(
          //moving upper left side
          startId + width + 1===targetId ||
          startId + width * 2 + 2===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
          startId + width * 3 + 3===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild ||
          startId + width * 4 + 4===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild ||
          startId + width * 5 + 5===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild ||
          startId + width * 6 + 6===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild ||
          startId + width * 7 + 7===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*6 + 6}"]`).firstChild ||
          //moving upper right side
          startId + width - 1===targetId ||
          startId + width * 2 - 2===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
          startId + width * 3 - 3===targetId && !document.querySelector(`[square-id="${startId + width -1 }"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild ||
          startId + width * 4 - 4===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild ||
          startId + width * 5 - 5===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild ||
          startId + width * 6 - 6===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild ||
          startId + width * 7 - 7===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*6 - 6}"]`).firstChild ||
          //moving lower left side
          startId - width + 1===targetId ||
          startId - width * 2 + 2===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
          startId - width * 3 + 3===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild ||
          startId - width * 4 + 4===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild ||
          startId - width * 5 + 5===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild ||
          startId - width * 6 + 6===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild ||
          startId - width * 7 + 7===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*6 + 6}"]`).firstChild ||
          // moving lower right  side 
          startId - width - 1===targetId ||
          startId - width * 2 - 2===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
          startId - width * 3 - 3===targetId && !document.querySelector(`[square-id="${startId - width -1 }"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild ||
          startId - width * 4 - 4===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild ||
          startId - width * 5 - 5===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild ||
          startId - width * 6 - 6===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild ||
          startId - width * 7 - 7===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*6 - 6}"]`).firstChild

        ){
          return true;
        }
        break;

      case 'rook':
        if(
          //moving front
          startId + width ===targetId ||
          startId + width * 2===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
          startId + width * 3===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild ||
          startId + width * 4===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild ||  
          startId + width * 5===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild ||   
          startId + width * 6===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild || 
          startId + width * 7===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*6}"]`).firstChild ||
          //moving back
          startId - width ===targetId ||
          startId - width * 2===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
          startId - width * 3===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild ||
          startId - width * 4===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild ||  
          startId - width * 5===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild ||   
          startId - width * 6===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild || 
          startId - width * 7===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*6}"]`).firstChild ||
          //moving left
          startId + 1 ===targetId ||
          startId + 2===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
          startId + 3===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
          startId + 4===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||  
          startId + 5===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||   
          startId + 6===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild || 
          startId + 7===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
          //moving right
          startId - 1 ===targetId ||
          startId - 2===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
          startId - 3===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
          startId - 4===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||  
          startId - 5===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||   
          startId - 6===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild || 
          startId - 7===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild

        ){
          return true;
        }
        break;
      case 'queen': //all the bishop + rook moves are valid
        if(
          //moving upper left side
          startId + width + 1===targetId ||
          startId + width * 2 + 2===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
          startId + width * 3 + 3===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild ||
          startId + width * 4 + 4===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild ||
          startId + width * 5 + 5===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild ||
          startId + width * 6 + 6===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild ||
          startId + width * 7 + 7===targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 + 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*6 + 6}"]`).firstChild ||
          //moving upper right side
          startId + width - 1===targetId ||
          startId + width * 2 - 2===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
          startId + width * 3 - 3===targetId && !document.querySelector(`[square-id="${startId + width -1 }"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild ||
          startId + width * 4 - 4===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild ||
          startId + width * 5 - 5===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild ||
          startId + width * 6 - 6===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild ||
          startId + width * 7 - 7===targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId + width*5 - 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId + width*6 - 6}"]`).firstChild ||
          //moving lower left side
          startId - width + 1===targetId ||
          startId - width * 2 + 2===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
          startId - width * 3 + 3===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild ||
          startId - width * 4 + 4===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild ||
          startId - width * 5 + 5===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild ||
          startId - width * 6 + 6===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild ||
          startId - width * 7 + 7===targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 + 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 + 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 + 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 + 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*6 + 6}"]`).firstChild ||
          // moving lower right  side 
          startId - width - 1===targetId ||
          startId - width * 2 - 2===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
          startId - width * 3 - 3===targetId && !document.querySelector(`[square-id="${startId - width -1 }"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild ||
          startId - width * 4 - 4===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild ||
          startId - width * 5 - 5===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild ||
          startId - width * 6 - 6===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild ||
          startId - width * 7 - 7===targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*2 - 2}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*3 - 3}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*4 - 4}"]`).firstChild 
                                             && !document.querySelector(`[square-id="${startId - width*5 - 5}"]`).firstChild
                                             && !document.querySelector(`[square-id="${startId - width*6 - 6}"]`).firstChild ||
          //moving front
          startId + width ===targetId ||
          startId + width * 2===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild ||
          startId + width * 3===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild ||
          startId + width * 4===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild ||  
          startId + width * 5===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild ||   
          startId + width * 6===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild || 
          startId + width * 7===targetId && !document.querySelector(`[square-id="${startId + width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + width*6}"]`).firstChild ||
          //moving back
          startId - width ===targetId ||
          startId - width * 2===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild ||
          startId - width * 3===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild ||
          startId - width * 4===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild ||  
          startId - width * 5===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild ||   
          startId - width * 6===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild || 
          startId - width * 7===targetId && !document.querySelector(`[square-id="${startId - width}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - width*2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - width*6}"]`).firstChild ||
          //moving left
          startId + 1 ===targetId ||
          startId + 2===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild ||
          startId + 3===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild ||
          startId + 4===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild ||  
          startId + 5===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild ||   
          startId + 6===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild || 
          startId + 7===targetId && !document.querySelector(`[square-id="${startId + 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId + 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId + 6}"]`).firstChild ||
          //moving right
          startId - 1 ===targetId ||
          startId - 2===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild ||
          startId - 3===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild ||
          startId - 4===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild ||  
          startId - 5===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild ||   
          startId - 6===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild || 
          startId - 7===targetId && !document.querySelector(`[square-id="${startId - 1}"]`).firstChild 
                                         && !document.querySelector(`[square-id="${startId - 2}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 3}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 4}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 5}"]`).firstChild
                                         && !document.querySelector(`[square-id="${startId - 6}"]`).firstChild


        ){
          return true;
        }
        break;
      
      case 'king':
        if(
          startId + 1 ===targetId ||
          startId - 1 ===targetId ||
          startId + width ===targetId ||
          startId - width ===targetId ||
          startId + width - 1 ===targetId ||
          startId - width - 1===targetId ||
          startId + width + 1===targetId ||
          startId - width + 1===targetId 
        ){
          return true;
        }
        break;
        
      }

      return false;
}

function checkForWin(){
  const kings= Array.from(document.querySelectorAll('.square #king'))
  if (kings.length === 0) {
    infoDisplay.textContent= "No kings found on the board!"
    disableDragging()
    return;
  }
  if(!kings.some(king=> king.classList.contains('beige'))){
    infoDisplay.textContent= "BLACK PLAYER WINS!!!"
    disableDragging()
    return

  }
  if(!kings.some(king=> king.classList.contains('black'))){
    infoDisplay.textContent= "WHITE PLAYER WINS!!!"
    disableDragging()
    return

  }
  
}
function disableDragging(){
  const allSquare= document.querySelectorAll('.square')
  allSquare.forEach(square=> square.firstChild?.setAttribute('draggable',false))
  return;
}


function changePlayer(){
    if(playerGo==="black"){
        reverseIds()
        playerGo= "beige"
        playerName.textContent="white"
    }else if(playerGo==="beige"){
        revertIds()
        playerGo="black"
        playerName.textContent="black"
    }

}
function reverseIds(){
    const allSquare= document.querySelectorAll(".square")    
    allSquare.forEach((ele,i)=>{
        ele.setAttribute("square-id",(width*width-1)-i)
    })

}
function revertIds(){
    const allSquare= document.querySelectorAll(".square")    
    allSquare.forEach((ele,i)=>{
        ele.setAttribute("square-id",i)
    })


}
