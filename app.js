const mainBoard= document.querySelector("#chessBoard")
const playerName= document.querySelector("#player")
const infoDisplay= document.querySelector("#info")

const eachCell= [
                rook, knight , bishop , queen , king , bishop , knight , rook ,
                pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                '' , '' , '' , '' , '' , '' , '' , '' ,
                pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
                rook, knight , bishop , king , queen , bishop , knight , rook
]

function createBoard() {
    eachCell.forEach((startPiece, index) => {
        const square = document.createElement('div');
        square.classList.add('square');

        // Alternate colors based on the index
        //(index/8) gives the row number 
        if (Math.floor(index / 8) % 2 === 0) {
            //if the row is even then it adds green color
            square.classList.add(index % 2 === 0 ? 'green' : 'dark');
        } else {
            square.classList.add(index % 2 === 0 ? 'dark' : 'green');
        }
        //adds the inner html of pieces ,if present
        if (startPiece) {
            square.innerHTML = startPiece; 
        }

        mainBoard.append(square);
    });
}
createBoard()
