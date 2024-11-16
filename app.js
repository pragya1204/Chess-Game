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
    targetSquare = e.target.parentNode.parentNode; // Get the parent square if a piece is targeted
  }

  const opponent = playerGo === "white" ? "black" : "white";
  const first_Child = targetSquare.firstChild; // Safely get firstChild only if it's a square

  const taken = first_Child !== null; // true if there's a piece in the square
  const valid = checkIfValid(e.target);
  const takenByOpponent = taken? targetSquare.classList.contains(opponent): false;

//   console.log("Correct:", correct);
//   console.log("Taken:", taken);
//   console.log("Taken by Opponent:", takenByOpponent);

  if (correct) {
    //if taken by the opponent and a valid move
    // if (takenByOpponent && valid) {
    //   e.target.parentNode.append(draggedElement);
    //   e.target.remove();
    //   changePlayer();
    //   return;
    // }

    //for invalid move
    if (taken && targetSquare.classList.contains(playerGo)) {
      infoDisplay.textContent = "you cannot go here!!!";
      setTimeout(() => (infoDisplay.textContent = ""), 2000);
      targetSquare.append(draggedElement);
      changePlayer();
      return;
    }

    //for valid move
    if (valid) {
    }
  }
}

function checkIfValid(target){
    console.log("target:",target);
    let targetId= Number(target.getAttribute("square-id"))
    if(targetId===null) targetId=Number(target.parentNode.parentNode.getAttribute("square-id"))
    let startId= Number(startPositionId)
    let piece= draggedElement.id
    console.log("targetID:",targetId);
    console.log("startId:",startId);
    console.log("piece:",piece);
    
    
    
    
    
    
}


function changePlayer(){
    if(playerGo==="black"){
        reverseIds()
        playerGo= "white"
        playerName.textContent="white"
    }else if(playerGo==="white"){
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
