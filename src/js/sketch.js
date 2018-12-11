let board;
let canvasSize;
let offset;
let cellSize;
let cellCount;
let filters;
let lvlSlider;
let font;
let fontSize;
let dist;

function preload() {
  font = loadFont('src/fonts/Chunkfive.otf');
  fontSize = 18;
}

function setup() {
  cellSize = 48;
  cellCount = 12;
  canvasSize = createVector( cellSize*21, cellSize*18 );
  createCanvas( canvasSize.x, canvasSize.y );

  textFont( font );
  textSize( fontSize );
  textAlign( CENTER );

  colorMode( HSB, 360 );

  offset = createVector( cellSize*3.5, cellSize*1.5 );
  filters = 10;
  lvlSlider = createSlider( 0, filters, 8 );
  lvlSlider.position(
    offset.x -0.05*cellSize,
    offset.y + (cellCount+0.7)*cellSize ); // canvasSize.x - 132 - cellSize
  lvlSlider.size( cellSize*filters );

  board = new Board( cellCount, cellSize, offset );
}

function draw() {
  background( 240 );

  if( mouseX > board.offset.x && mouseX < board.offset.x + board.size*board.count &&
      mouseY > board.offset.y && mouseY < board.offset.y + board.size*board.count )
    board.overBoard = true;
  else
    board.overBoard = false;

  board.draw( lvlSlider.value() );
}

function mousePressed() {
  if( board.overBoard ) {
    let x = Math.floor( (mouseX - board.offset.x ) / board.size );
    let y = Math.floor( (mouseY - board.offset.y ) / board.size );

    switch ( lvlSlider.value() ) {
      case 0:
        if ( board.grid[x][y].free ){
          board.grid[x][y].free = false;
          board.grid[x][y].token.copy( board.offer.token );
          board.newChoice();
        }
        break;
      case 1:
        console.log(
          "Cell:", board.grid[x][y].index,
          "Type:", board.grid[x][y].terrain.type,
          "Biom:", board.grid[x][y].terrain.biomeIndex,
          "Size:", board.grid[x][y].terrain.biomeSize );
        break;
    }

    if ( lvlSlider.value() > 1 && lvlSlider.value() < 8 )
      console.log(
        "Cell:", board.grid[x][y].index,
        "Type:", board.grid[x][y].terrain.type,
        "dReal", board.grid[x][y].deltaWorth[board.grid[x][y].terrain.type].real.toFixed( 2 ),
        "Goal:", board.grid[x][y].worth[board.grid[x][y].terrain.type],
        "Distr:", board.grid[x][y].distribution["height"].toFixed( 2 ),
        "Bmin:", board.plotBoundaries[ board.grid[x][y].terrain.type].min.toFixed( 2 ),
        "Bmax:", board.plotBoundaries[ board.grid[x][y].terrain.type].max.toFixed( 2 )
      );

    if ( lvlSlider.value() > 7 )
      console.log(
        "Cell:", board.grid[x][y].index,
        "Type:", board.grid[x][y].terrain.type,
         board.filters[lvlSlider.value()-7], board.grid[x][y].distribution[board.filters[lvlSlider.value()-7]].toFixed( 2 )
        /*"dA:", board.grid[x][y].distribution["animal"].toFixed( 2 ),
        "dP:", board.grid[x][y].distribution["plant"].toFixed( 2 ),
        "dM:", board.grid[x][y].distribution["mineral"].toFixed( 2 ),*/
      );
  }

}
