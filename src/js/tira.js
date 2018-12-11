class Tira {
   constructor( index, vec, size, offset, terrain, distribution ){
      this.index = index ? index : 0;
      this.x = vec.x;
      this.y = vec.y;
      this.size = size;
      this.offset = offset ? offset : createVector( 0, 0 );
      this.terrain = terrain;
      this.distribution = distribution;
      this.free = true;
      this.token = new Token();
      this.worth = {
        "lake": -1,
        "river": -0.6,
        "plain": -0.2,
        "hill": 0.2,
        "forest": 0.6,
        "mount": 1
      }
      this.growth = {
        "animal": 5,
        "plant": 9,
        "mineral": 2
      }
      this.deltaWorth = {
        "lake": {
           real: null,
           boundary: null
         },
        "river": {
           real: null,
           boundary: null
         },
        "plain": {
           real: null,
           boundary: null
         },
        "hill": {
           real: null,
           boundary: null
         },
        "forest": {
           real: null,
           boundary: null
         },
        "mount": {
           real: null,
           boundary: null
         }
      }
      this.onBoard = true;
      this.overBox = false;
      this.center = createVector(
        ( this.x + 0.5 )*this.size + this.offset.x,
        ( this.y + 0.5 )*this.size + this.offset.y );
    }

    setTerrain( index, t, size ){
      this.terrain.biomeIndex = index;
      this.terrain.biomeSize = size;
      this.terrain.default = false;
      this.terrain.type = t.type;
      this.terrain.color = t.color;
      this.terrain.hue = t.hue;
      this.deltaWorth[this.terrain.type].real = Math.abs( this.distribution["height"] - this.worth[this.terrain.type] );
    }

    draw( lvl, always ){
      let t, h, s, b;
      if ( !always ){
        t = this.terrain.type;
        h = this.terrain.hue;
        s = ( 1 - this.deltaWorth[t].boundary )*360;
        b = 360;
      }

      //pick a terrain color
      if ( !always && this.free )
        switch ( lvl ) {
          case 0:
            fill( 240 );
            break;
          case 1:
            s = 270;
            if ( t == "mount" )
              s = 150;
            fill( h, s, b );
            break;
          case 2:
            if ( t == "plain" ){
              fill( h, s,  b );
            }
            else
              fill( 180 );
            break;
          case 3:
            if ( t == "forest" ){
              fill( h, s,  b );
            }
            else
              fill( 180 );
            break;
          case 4:
            if ( t == "lake" ){
              fill( h, s,  b );
            }
            else
              fill( 180 );
            break;
          case 5:
            if ( t == "hill" ){
              fill( h, s,  b );
            }
            else
              fill( 180 );
            break;
          case 6:
            if ( t == "mount" ){
              fill( h, s,  b );
            }
            else
              fill( 180 );
            break;
          case 7:
            fill( h, s, b );//+ 1)/2*360 );
            break;
          case 8:
            s = this.distribution["plant"]*360;
            b = this.distribution["plant"]*360;
            fill( h, s, b );
            break;
          case 9:
            s = this.distribution["animal"]*360;
            b = this.distribution["animal"]*360;
            fill( h, s, b );
            break;
          case 10:
            s = this.distribution["mineral"]*360;
            b = this.distribution["mineral"]*360;
            fill( h, s, b );
          break;
          default:
            fill( 240 );
            break;

        }
      else
        fill( 240 );

      //draw cell frame
      stroke(1);
      rect( this.center.x-this.size/2, this.center.y-this.size/2, this.size, this.size );

      if ( !this.free )
        this.token.draw( lvl, this.center, this.size, true);
    }
}
