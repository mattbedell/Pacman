class GridProperties {
  constructor(gridRow, gridColumn, totalId) {
    this.canMove = {
      dUp: true,
      dDown: true,
      dLeft: true,
      dRight: true
    }
    this.elmnt;
    this.row = gridRow;
    this.col = gridColumn;
    this.gridId = totalId;
    this.hasDot = true;
    this.addElmnts();
  }
  addElmnts() {
    let appendToThisRowElmntClass = '.r' + this.row;
    let defaultGridClass = 'gridBlock';
    let gridIdNumClass = 'gb' + this.gridId;
    let newElmntClasses = defaultGridClass + ' ' + gridIdNumClass;
    let gridElmntToAppend = '<div class="' + newElmntClasses + '"></div>';
    $(appendToThisRowElmntClass).append(gridElmntToAppend);

    let setJqueryElmntPointerClass = '.' + gridIdNumClass;
    this.elmnt = $(setJqueryElmntPointerClass);
    this.addDot();
  }
  addDot() {
    this.hadDot = true;
    let dotClasses = 'dot ' + 'dotID' + this.gridId;
    let dotElmnt = '<div class="' + dotClasses + '"></div>';
    $(this.elmnt).append(dotElmnt);
  }
  removeDot() {
    this.hasDot = false;
    $(this.elmnt).children().removeClass('dot');
  }
}
class GameBoard {
  constructor(numRows, numColumns, borderStyle) {
    this.grid = [];
    let idCounter = 0;
    for(let i = 0; i < numRows; i++) {
      let rowDefaultClass = 'row';
      let rowIdClass = 'r' + i;
      let newRowClasses = rowDefaultClass + ' ' + rowIdClass;
      let rowElmntToAppend = '<div class="' + newRowClasses + '"></div>';
      $('.gameBoard').append(rowElmntToAppend);
      this.grid[i] = [];

      for(let j = 0; j < numColumns; j++) {
        this.grid[i][j] = new GridProperties(i, j, idCounter);
        idCounter++;
      }
    }
    this.drawBorders(borderStyle);
  }
  drawBorders(borderProp) {
    for(let i = 0; i < this.grid[0].length; i++) {
      this.grid[0][i].elmnt.css('border-top', borderProp);//Top Border
      this.grid[0][i].canMove.dUp = false;

      this.grid[this.grid.length - 1][i].elmnt.css('border-bottom', borderProp);//Bottom Border
      this.grid[this.grid.length - 1][i].canMove.dDown = false;
    }
    for(let i = 0; i < this.grid.length; i++) {
      this.grid[i][0].elmnt.css('border-left', borderProp);//Left Border
      this.grid[i][0].canMove.dLeft = false;

      this.grid[i][this.grid[0].length - 1].elmnt.css('border-right', borderProp);//Right Border
      this.grid[i][this.grid[0].length - 1].canMove.dRight = false;
    }
  }
  updateGrid(mySprite, direction) {
    this.grid[mySprite.row][mySprite.column].elmnt.css('background-image', mySprite.assets.current);
    switch(direction) {
      case 'right':
        this.grid[mySprite.row ][mySprite.column - 1].elmnt.css('background-image', '');
        break;
      case 'left':
        this.grid[mySprite.row][mySprite.column + 1].elmnt.css('background-image', '');
        break;
      case 'up':
        this.grid[mySprite.row + 1][mySprite.column ].elmnt.css('background-image', '');
        break;
      case 'down':
        this.grid[mySprite.row - 1][mySprite.column ].elmnt.css('background-image', '');
        break;
    }
  }
}
class Sprite {
  constructor(spriteType, startingRow, startingColumn, gBoard) {
    this.spriteType = spriteType;
    this.aiDirection;
    this.row = startingRow;
    this.column = startingColumn;
    this.readGrid = gBoard;
    this.assets = {
      counter: 0,
      current: undefined,
      list: undefined,
    }
    switch(this.spriteType) {
      case 'pacman':
        this.assets.list = {
          aRight: ['url(assets/pacStart.png)', 'url(assets/pacRight2.png)', 'url(assets/pacRight3.png)'],
          aLeft: ['url(assets/pacStart.png)', 'url(assets/pacLeft2.png)', 'url(assets/pacLeft3.png)'],
          aUp: ['url(assets/pacStart.png)', 'url(assets/pacUp2.png)', 'url(assets/pacUp3.png)'],
          aDown: ['url(assets/pacStart.png)', 'url(assets/pacDown2.png)', 'url(assets/pacDown3.png)']
        }
        break;
      case 'ghostRed':
        this.assets.list = 'url(assets/ghostRed.png)';
        break;
    }
  }
  checkMove(direction) {
    switch(direction) {
      case 'right':
        if (this.readGrid[this.row][this.column].canMove.dRight === true) {
          this.column += 1;
          this.updateAsset(direction);
        }
        break;
      case 'left':
        if (this.readGrid[this.row][this.column].canMove.dLeft === true) {
          this.column -= 1;
          this.updateAsset(direction);
        }
        break;
      case 'up':
        if (this.readGrid[this.row][this.column].canMove.dUp === true) {
          this.row -= 1;
          this.updateAsset(direction);
        }
        break;
      case 'down':
        if (this.readGrid[this.row][this.column].canMove.dDown === true) {
          this.row += 1;
          this.updateAsset(direction);
        }
        break;
    }
  }
  updateAsset(direction) {
    switch(direction){
      case 'right':
        if(this.assets.counter < this.assets.list.aRight.length) {
          this.assets.current = this.assets.list.aRight[this.assets.counter];
          this.assets.counter++;
        } else {
          this.assets.counter = 0;
          this.assets.current = this.assets.list.aRight[this.assets.counter];
          this.assets.counter++;
        }
      break;
      case 'left':
        if(this.assets.counter < this.assets.list.aLeft.length) {
          this.assets.current = this.assets.list.aLeft[this.assets.counter];
          this.assets.counter++;
        } else {
          this.assets.counter = 0;
          this.assets.current = this.assets.list.aLeft[this.assets.counter];
          this.assets.counter++;
        }
      break;
      case 'up':
        if(this.assets.counter < this.assets.list.aUp.length) {
          this.assets.current = this.assets.list.aUp[this.assets.counter];
          this.assets.counter++;
        } else {
          this.assets.counter = 0;
          this.assets.current = this.assets.list.aUp[this.assets.counter];
          this.assets.counter++;
        }
      break;
      case 'down':
        if(this.assets.counter < this.assets.list.aDown.length) {
          this.assets.current = this.assets.list.aDown[this.assets.counter];
          this.assets.counter++;
        } else {
          this.assets.counter = 0;
          this.assets.current = this.assets.list.aDown[this.assets.counter];
          this.assets.counter++;
        }
      break;
    }
  }
}


class GameController {
  constructor() {
    this.playerInput = 'right';
    this.board = new GameBoard(20, 20, '1px solid blue');
    this.player = new Sprite('pacman', 0, 0, this.board.grid);
    this.intervalId;
    this.runMove();
    this.getInput();
  }
  runMove() {
    let that = this;
    this.intervalId = setInterval(function() {
      that.player.checkMove(that.playerInput);
      that.board.updateGrid(that.player, that.playerInput);
    }, 100)
  }
  getInput() {
    let that = this;
    $('body').on('keydown', function(e){
       switch(e.keyCode){
          case 38://UP
            that.playerInput = 'up';
          break;
          case 40://DOWN
            that.playerInput = 'down';
          break;
          case 37://LEFT
            that.playerInput = 'left';
          break;
          case 39://RIGHT
            that.playerInput = 'right';
          break;
       }
    })
  }
}
class MapBuilder {
  constructor(boardGrid) {
    this.grid = boardGrid;
    this.wallCoords = {
      rI: [],
      cI: []
    }
  }
  runClick(direction) {
    let that = this;
    switch(direction){
      case 'rows':
      for(let i = 0; i < this.grid.length; i++) {
        for(let j = 0; j < this.grid[0].length; j++) {
          this.grid[i][j].elmnt.on('click', function(){
            that.drawRows(i, j);
          })
        }
      }
      break;
      case 'columns':
        for(let i = 0; i < this.grid.length; i++) {
          for(let j = 0; j < this.grid[0].length; j++) {
            this.grid[i][j].elmnt.on('click', function(){
              that.drawColumns(i, j);
            })
          }
        }
      break;
    }
  }
  drawRows(rIndex, cIndex) {
    this.wallCoords.rI.push(rIndex);
    this.wallCoords.cI.push(cIndex);
    this.grid[rIndex][cIndex].elmnt.css('border-right', '1px solid blue');
    this.grid[rIndex][cIndex].canMove.dRight = false;
    this.grid[rIndex][cIndex + 1].canMove.dLeft = false;
  }
  drawColumns(rIndex, cIndex) {
    this.wallCoords.rI.push(rIndex);
    this.wallCoords.cI.push(cIndex);
    this.grid[rIndex][cIndex].elmnt.css('border-bottom', '1px solid blue');
    this.grid[rIndex][cIndex].canMove.dDown = false;
    this.grid[rIndex + 1][cIndex].canMove.dUp = false;
  }
}









var game = new GameController();
var mapB = new MapBuilder(game.board.grid);
