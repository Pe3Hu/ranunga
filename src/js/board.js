class Board {
   constructor ( count, size, offset ){
     this.count = count ? count : 12;
     this.size = size ? size : 48;
     this.offset = offset ? offset : createVector( this.size/2, this.size/2 );
     this.overBoard = false;
     this.tokeCounter = 0;
     this.filters =  [ "height", "plant", "animal", "mineral" ];
     this.tokenTypes = [ "meeple",  "construction", "pawn" ];
     this.pawns = [ "fruit", "grass", "branch", "tree", "mushroom", "fowl", "animal", "fish", "cobblestone" ];
     this.tokenClasses = {
       "meeple": {

       },
       "construction": {

       },
       "pawn": {
         "plain": [ "fruit", "grass" ],
         "forest": [ "fruit", "branch", "tree", "mushroom", "fowl", "animal" ],
         "river": [ "fish" ],
         "lake": [ "fish" ],
         "hill": [ "stone", "grass", "animal" ],
         "mount": [ "stone", "fowl" ]
       },
       "resource": {
          "fruit": { 1: "food" },
          "grass": { 1: "fiber", 2: [ "cloth", "rope" ], }, //трава волокно ткань веревка
          "tree": { 1: "trunk", 2: "log" },  //дерево ствол полено
          "branch": { 1: "cane", 2: "stave", 3: "bar" }, //ветка прут шест брус
          "mushroom": { 1: "food" },
          "fowl": { 1: [ "food", "plumage" ] }, //птица еда перо
          "animal": { 1: [ "food", "fur" ] }, // животное еда шкура
          "fish": { 1: "food" },
          "cobblestone": { 1: "rock", 2: "block" } //булыжник камень блок
       }
     };
     this.terrainTypes = [ "plain",  "forest", "river", "lake", "hill", "mount" ];
     this.terrainColors = [ color( "#b5ff6b" ), color( "#38bf03" ), color( "#81b5d1" ),
     color( "#1c7dd5" ), color( "#fdd8a3" ), color( "#b3c8cd" ) ];
     this.terrainHues = [ 80, 120, 180, 220, 50, 270 ];
     this.biomeCounters = [ 0, 0, 0, 0, 0, 0 ];
     this.biomeQuantity = [ 0, 3, 0, 2, 1, 2];
     this.biomeNorm = [ 0, 8, 0, 6, 20, 5];
     this.biomeAmplitude = [ 0, 5, 0, 3, 5, 3];
     this.plotBoundaries = {
       "lake": {
          min: null,
          max: null
        },
       "river": {
          min: null,
          max: null
        },
       "plain": {
          min: null,
          max: null
        },
       "hill": {
          min: null,
          max: null
        },
       "forest": {
          min: null,
          max: null
        },
       "mount": {
          min: null,
          max: null
        }
     }
     this.grid = [];
     this.notes = [];

     this.createGrid();
     this.normalizeDistribution();

     this.offer = new Tira( -1, createVector( this.count - 2, this.count + 1 ), this.size, this.offset, new Terrain(), null );
     this.offer.free = false;
     this.newChoice();

     this.test = new Tira( -2, createVector( this.count - 1, this.count + 1 ), this.size, this.offset, new Terrain(), null );
     this.test.free = false;
     this.tokeCounter++;
     let type = "pawn";
     let hue = Math.floor( Math.random()*360 );
     let stage = Math.floor( Math.random()*4 ) + 1;
     let clas = "tree";
     this.test.token = new Token( this.tokeCounter, type, clas, stage, hue );

     this.createMap();
     this.resourceCalculation();
     this.setPlayerInterface();
    }

    //create grid of tiras with smooth distribution values
    createGrid(){
      let yoff = [
        Math.random()*this.count,
        ( Math.random() + 1 )*this.count,
        ( Math.random() + 2 )*this.count,
        ( Math.random() + 3 )*this.count,
      ];
      let inc = 0.1;

      for( let i = 0; i < this.count; i++ ){
        this.grid.push( [] );
        let xoff = 0;
        for( let j = 0; j < this.count; j++ ){
          let index = i*this.count + j;
          let terrain = new Terrain( this.terrainTypes[0], this.terrainColors[0], this.terrainHues[0] );
          let n = {
            "height": noise( xoff, yoff[0] ),
            "plant": noise( xoff, yoff[1] ),
            "animal": noise( xoff, yoff[2] ),
            "mineral": noise( xoff, yoff[3] ),
          };
          let obj = new Tira( index, createVector(i,j), this.size, this.offset, terrain, n );
          this.grid[i].push( obj );
          xoff += inc;
        }
        for( let f = 0; f < 4; f++ )
          yoff[f] += inc;
      }
    }

    //bring a distributions to the [0,1] segment
    normalizeDistribution(){

      for( let f = 0; f < this.filters.length; f++ ){
        let min = 1;
        let max = 0;

        for( let i = 0; i < this.grid.length; i++ )
          for( let j = 0; j < this.grid[i].length; j++ ){
            if( this.grid[i][j].distribution[this.filters[f]] > max )
              max = this.grid[i][j].distribution[this.filters[f]];
            if( this.grid[i][j].distribution[this.filters[f]] < min )
              min = this.grid[i][j].distribution[this.filters[f]];
          }

        for( let i = 0; i < this.grid.length; i++ )
          for( let j = 0; j < this.grid[i].length; j++ )
            this.grid[i][j].distribution[this.filters[f]] = map( this.grid[i][j].distribution[this.filters[f]], min, max, 0, 1 );
      }
    }

    //generate a new offer tira
    newChoice(){
      this.tokeCounter++;
      let type = "meeple";
      let hue = Math.floor( Math.random()*360 );
      let stage = Math.floor( Math.random()*4 ) + 1;
      let clas = "meh";
      this.offer.token = new Token( this.tokeCounter, type, clas, stage, hue );
    }

    //generate on the grid a biome with specified type and size
    createTerrain( index, max ){
     let terrain = new Terrain( this.terrainTypes[index], this.terrainColors[index], this.terrainHues[index] );
     let neighbors = [];
     let biome = [];
     let trapCheck = false;
     let clearStart = false;
     let randStart;

     //generate unoccupied indexs for start cell
     while ( !clearStart ){
       randStart = createVector(
         Math.floor( Math.random()*this.count ),
         Math.floor( Math.random()*this.count ));
       if ( this.grid[randStart.x][randStart.y].terrain.default )
        clearStart = true;
     }
     biome.push( randStart );
     this.grid[biome[0].x][biome[0].y].setTerrain( this.biomeCounters[index], terrain, max );

     //create max tiles of terrain
     while ( biome.length < max && !trapCheck ){
       neighbors = [];
       for( let b = 0; b < biome.length; b++ )
         for( let i = 0; i < this.grid.length; i++ )
           for( let j = 0; j < this.grid[i].length; j++ ){
             let dx = Math.abs( biome[b].x - this.grid[i][j].x );
             let dy = Math.abs( biome[b].y - this.grid[i][j].y );
             let d = dx + dy;

             //distance and already visited check
             if( d == 1 && this.grid[i][j].terrain.default )
               neighbors.push( createVector( i, j ) );
           }

       let rand = Math.floor( Math.random()*neighbors.length );
       let randNeighbor;
       if ( neighbors.length == 0 )
         trapCheck = true;
       else{
         randNeighbor = createVector( neighbors[rand].x, neighbors[rand].y );
         biome.push( randNeighbor );
         this.grid[biome[biome.length-1].x][biome[biome.length-1].y].setTerrain( this.biomeCounters[index], terrain, max );

         //delete used neighbor
         for( let n = neighbors.length-1; n >=0; n-- )
         if( ( neighbors[n].x == randNeighbor.x ) &&
             ( neighbors[n].y == randNeighbor.y ) )
           neighbors.splice(n, 1);
         }
       }

       //recording biome surplus by unseted cells
       let abundance = max - biome.length;
       if( trapCheck )
         for( let i = 0; i < this.grid.length; i++ )
           for( let j = 0; j < this.grid[i].length; j++ )
            if( this.grid[i][j].terrain.biomeIndex == this.biomeCounters[index] )
              this.grid[i][j].terrain.setFeature( abundance );
     }

     //set all types of areas on the grid
    createMap(){
      for( let t = 0; t < this.terrainTypes.length; t++ )
        for( let q = 0; q < this.biomeQuantity[t]; q++ ){
          let rand = Math.floor( this.biomeAmplitude[t]*( Math.random()*2 - 1 ));
          let size = this.biomeNorm[t] + rand;
          this.createTerrain( t, size, this.biomeCounters[t] );
          this.biomeCounters[t]++;
        }

      //recalculation of unoccupied cells

      for( let f = 0; f < this.filters.length; f++ )
        for( let i = 0; i < this.grid.length; i++ )
          for( let j = 0; j < this.grid[i].length; j++ ){
            let t = this.grid[i][j].terrain.type;
            let d = this.grid[i][j].distribution[this.filters[f]]*2 - 1;
            let w = this.grid[i][j].worth[t];
            let r = Math.abs( d - w );

            this.grid[i][j].deltaWorth[t].real =  r;
          }
      }

    //set values of resource
    resourceCalculation(){
      for( let t = 0; t < this.terrainTypes.length; t++ ){
        let min = 2;
        let max = 0;
        let type = this.terrainTypes[t];

        for( let i = 0; i < this.grid.length; i++ )
          for( let j = 0; j < this.grid[i].length; j++ )
            if( this.grid[i][j].terrain.type == type ){
              if( this.grid[i][j].deltaWorth[type].real > max )
                max = this.grid[i][j].deltaWorth[type].real;
              if( this.grid[i][j].deltaWorth[type].real < min )
                min = this.grid[i][j].deltaWorth[type].real;
            }

        this.plotBoundaries[type].min = min;
        this.plotBoundaries[type].max = max;

        for( let i = 0; i < this.grid.length; i++ )
          for( let j = 0; j < this.grid[i].length; j++ )
            if ( this.grid[i][j].terrain.type == type )
              this.grid[i][j].deltaWorth[type].boundary = map( this.grid[i][j].deltaWorth[type].real, min, max, 0, 1 );
      }
    }

    //text data display
    setPlayerInterface(){
      //filters note
      let txt = "Map Filters";
      let vec = createVector(
        offset.x + ( filters + 1 )/2*this.size,
        offset.y + ( this.count + 0.5 )*this.size );
      let note = new Note( this.notes.length, txt, vec );
      this.notes.push( note );

      //terrain types for goal values
      for( let i = 0; i < this.terrainTypes.length; i++ ){
        let txt = this.terrainTypes[i];
        /*let vec = createVector(
         offset.x + ( this.count + 2 )*this.size,
         offset.y + this.size +  i*fontSize );*/
        let vec = createVector(
          offset.x + 0.5*this.size,
          offset.y + ( this.count + 1.7 )*this.size + i*fontSize );
        let note = new Note( this.notes.length, txt, vec );
        this.notes.push( note );
      }

      //terrain types for goal values
      for( let i = 0; i < this.terrainTypes.length; i++ ){
        let t = this.terrainTypes[i];
        let txt = this.plotBoundaries[t].min.toFixed( 2 );
        let vec = createVector(
          offset.x + 2*this.size,
          offset.y + ( this.count + 1.7 )*this.size + i*fontSize );
        let note = new Note( this.notes.length, txt, vec );
        this.notes.push( note );
      }

    }

    //drawing game frame
    draw( lvl ){
      //draw game board
      for( let row of this.grid )
        for( let col of row )
            col.draw( lvl );

      //draw offer tira
      this.offer.draw( lvl, true );
      this.test.draw( lvl, true );

      //draw notes
      for( let row of this.notes )
        row.draw( lvl );
    }
}

//random chained biome
/*
while ( biome.length < max ){
  for( let b = 0; b < biome.length; b++ ){
    for( let i = 0; i < this.grid.length; i++ )
      for( let j = 0; j < this.grid[i].length; j++ ){
        let dx = Math.abs( biome[b].x - this.grid[i][j].x );
        let dy = Math.abs( biome[b].y - this.grid[i][j].y );
        let d = dx + dy;
        //distance and already visited check
        if( d == 1 && !this.grid[i][j].neighborCheck ){
          this.grid[i][j].neighborCheck = true;
          neighbors.push( createVector( i, j ) );
        }
      }
  }

  let rand = Math.floor( Math.random()*neighbors.length );
  let randNeighbor = createVector( neighbors[rand].x, neighbors[rand].y );
  biome.push( randNeighbor );
  neighbors.splice(rand, 1);
}
*/

//concentrate random biome
/*
while ( biome.length < max ){
  neighbors = [];
  for( let b = 0; b < biome.length; b++ ){
    for( let i = 0; i < this.grid.length; i++ )
      for( let j = 0; j < this.grid[i].length; j++ ){
        let dx = Math.abs( biome[b].x - this.grid[i][j].x );
        let dy = Math.abs( biome[b].y - this.grid[i][j].y );
        let d = dx + dy;
        //distance and already visited check
        if( d == 1 && this.grid[i][j].terrain.default ){
          neighbors.push( createVector( i, j ) );
        }
      }
  }

  let rand = Math.floor( Math.random()*neighbors.length );
  let randNeighbor = createVector( neighbors[rand].x, neighbors[rand].y );
  biome.push( randNeighbor );
  this.grid[biome[biome.length-1].x][biome[biome.length-1].y].setTerrain( terrain );

  for( let n = neighbors.length-1; n >=0; n-- )
   if( ( neighbors[n].x == randNeighbor.x ) &&
       ( neighbors[n].y == randNeighbor.y ) )
     neighbors.splice(n, 1);
}
*/
