const mainBoard= document.querySelector("#chessBoard")
const playerName= document.querySelector("#player")
const infoDisplay= document.querySelector("#info")
const width=8
const playerGo='white'


const eachCell= [
                rook, knight , bishop , queen , king , bishop , knight , rook ,
                pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
                rook, knight , bishop , queen, king, bishop , knight , rook
]

function createBoard() {
    eachCell.forEach((startPiece, index) => {
        const square = document.createElement('div');
        square.classList.add('square');

        // Alternate colors based on the index
        //(index/8) gives the row number 
        if (Math.floor(index / 8) % 2 === 0) {
            //if the row is even then it adds green color
            square.classList.add(index % 2 === 0 ? 'green' : 'light');
        } else {
            square.classList.add(index % 2 === 0 ? 'light' : 'green');
        }

        //adds the inner html of pieces ,if present
        if (startPiece) {
            square.innerHTML = startPiece
            square.setAttribute('square-id',index)
            if(index<16){
                square.firstChild.classList.add('black')
            }else if(index>=48) {
                square.firstChild.classList.add('beige')
            }

        }
        square.firstChild.setAttribute('draggable',true)//to make the pieces draggable
        square.firstChild.addEventListener('dragstart',dragStart)

        mainBoard.append(square);
    });
}
createBoard()

let allSquare= document.querySelectorAll('#chessBoard .square')
allSquare.forEach(square=>{
    square.addEventListener('dragstart',dragStart)
    square.addEventListener('dragover',dragOver)
    square.addEventListener('drop',dragDrop)
})

let startPositionId
let draggedElement
function dragStart(e){
    draggedElement= e.target
    startPositionId= e.target.parentNode.getAttribute('square-id')
    draggedElement.classList.add('dragging');
    e.target.parentNode.classList.add('dragging');
}

function dragOver(e){
    e.preventDefault()

}

function dragDrop(){
    e.stopPropagation();
     

}

function changePlayer(){

}
function reverseIds(){
    let allSquare= document.querySelectorAll('.square')
    allSquare.forEach((square,i)=>{
        square.setAttribute('square-id',(width*width-1)-i)

    })
}
function revertIds(){
    let allSquare= document.querySelectorAll('.square')
    allSquare.forEach((square,i)=>{
        square.setAttribute('square-id',i)

    })
}
