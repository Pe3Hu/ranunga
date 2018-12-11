class Token {
  constructor ( index, type, clas, stage, hue, saturation, brightness ) {
    this.index = index ? index : null;
    this.type = type ? type : null;
    this.class = clas ? clas : null;
    this.stage = stage ? stage : null;
    this.hue = hue ? hue : 0;
    this.saturation = saturation ? saturation : 360;
    this.brightness = brightness ? brightness : 360;
  }

  copy( token ){
    this.index = token.index;
    this.type = token.type;
    this.class = token.class;
    this.stage = token.stage;
    this.hue = token.hue;
    this.saturation = token.saturation;
    this.brightness = token.brightness;
  }

  wipeOff(){
    this.index = null;
    this.type = null;
    this.class = null;
    this.stage = null;
    this.hue = 0;
    this.saturation = 360;
    this.brightness = 360;
  }

  draw( lvl, center, size, always ){
    let part = size/12;
    let h = this.hue;
    let s = this.saturation;
    let b = this.brightness;
    //fill( h, s, b );

    //draw token icon
    noStroke();
    if( this.type == "meeple" && ( lvl == 0 || always ))
      switch ( this.stage ) {
        case 1:
          fill( h, s, b );
          ellipse( center.x, center.y, 8*part, 8*part );
          break;

        case 2:
          fill( h, s, b );
          triangle(
            center.x, center.y - 4*part,
            center.x - 4*part, center.y + 4*part*( Math.sqrt(3) - 1 ),
            center.x + 4*part, center.y + 4*part*( Math.sqrt(3) - 1 ));
          break;

        case 3:
          fill( h, s, b );
          rect( center.x-4*part, center.y-4*part, 8*part, 8*part );
          break;

        case 4:
          fill( h, s, b );
          triangle(
            center.x + Math.sin( Math.PI*7/6 )*4*part, center.y + Math.cos( Math.PI*7/6 )*4*part,
            center.x + Math.sin( Math.PI*9/6 )*4*part, center.y + Math.cos( Math.PI*9/6 )*4*part,
            center.x + Math.sin( Math.PI*11/6 )*4*part, center.y + Math.cos( Math.PI*11/6 )*4*part);

          rect(
            center.x + Math.sin( Math.PI*7/6 )*4*part, center.y + Math.cos( Math.PI*7/6 )*4*part,
            4*part, Math.sqrt(3 )*4*part);

          triangle(
            center.x + Math.sin( Math.PI*1/6 )*4*part, center.y + Math.cos( Math.PI*1/6 )*4*part,
            center.x + Math.sin( Math.PI*3/6 )*4*part, center.y + Math.cos( Math.PI*3/6 )*4*part,
            center.x + Math.sin( Math.PI*5/6 )*4*part, center.y + Math.cos( Math.PI*5/6 )*4*part);
          break;
      }

    if( this.type == "pawn" && ( lvl == 0 || always ))
    switch ( this.class ) {
      case "fish":
        fill( 210, s, b );
        triangle(
          center.x - 2*part, center.y,
          center.x - 4*part, center.y - 2*part,
          center.x - 4*part, center.y + 2*part);
        triangle(
          center.x - 2*part, center.y,
          center.x + 4*part, center.y,
          center.x + 1*part, center.y + 2*part);
        triangle(
          center.x - 2*part, center.y,
          center.x + 4*part, center.y,
          center.x + 1*part, center.y - 2*part);
      break;

      case "fruit":
        //the pulp
        fill( 0, s, b );
        triangle(
          center.x, center.y - 4*part,
          center.x + 3*part, center.y + 2*part,
          center.x - 3*part, center.y + 2*part);

        //the crust
        fill( 120, s, b );
        triangle(
          center.x + 2*part, center.y + 3*part,
          center.x + 3*part, center.y + 2*part,
          center.x + 2*part, center.y + 2*part);
        triangle(
          center.x - 2*part, center.y + 3*part,
          center.x - 3*part, center.y + 2*part,
          center.x - 2*part, center.y + 2*part);
        triangle(
          center.x - 2*part, center.y + 3*part,
          center.x + 3*part, center.y + 2*part,
          center.x - 2*part, center.y + 2*part);
        triangle(
          center.x + 2*part, center.y + 3*part,
          center.x - 2*part, center.y + 3*part,
          center.x + 2*part, center.y + 2*part);
      break;

      case "grass":
        fill( 80, s, b );
        //bot part
        triangle(
          center.x + 4*part, center.y + 4*part,
          center.x + 2*part, center.y + 1*part,
          center.x + 2*part, center.y + 4*part);
        triangle(
          center.x - 2*part, center.y + 1*part,
          center.x + 2*part, center.y + 1*part,
          center.x + 2*part, center.y + 4*part);
        triangle(
          center.x + 4*part, center.y + 4*part,
          center.x - 2*part, center.y + 1*part,
          center.x - 4*part, center.y + 4*part);

        //top part
        fill( 60, s, 300 );
        triangle(
          center.x + 2*part, center.y + 1*part,
          center.x - 2*part, center.y + 1*part,
          center.x - 2*part, center.y - 1*part);
        triangle(
          center.x + 2*part, center.y + 1*part,
          center.x + 2*part, center.y - 1*part,
          center.x - 2*part, center.y - 1*part);

        //top part
        fill( 80, s, b );
        triangle(
          center.x + 4*part, center.y - 4*part,
          center.x + 2*part, center.y - 1*part,
          center.x + 2*part, center.y - 4*part);
        triangle(
          center.x - 4*part, center.y - 4*part,
          center.x - 2*part, center.y - 1*part,
          center.x + 4*part, center.y - 4*part);
        triangle(
          center.x - 2*part, center.y - 1*part,
          center.x + 2*part, center.y - 1*part,
          center.x + 2*part, center.y - 4*part);

      break;

      case "tree":
        //the krone
        fill( 120, s, 300 );
        triangle(
          center.x, center.y - 1*part,
          center.x - 4*part, center.y + 4*part,
          center.x + 4*part, center.y + 4*part);
        triangle(
          center.x, center.y - 2.5*part,
          center.x - 3*part, center.y + 1.5*part,
          center.x + 3*part, center.y + 1.5*part);
        triangle(
          center.x, center.y - 4*part,
          center.x - 2*part, center.y - 1*part,
          center.x + 2*part, center.y - 1*part);
      break;

      case "animal":
        part = size/8;

        //the body
        fill( 60, s, b );
        triangle(
          center.x - 1.5*part, center.y + 1*part,
          center.x + 0.5*part, center.y + 1*part,
          center.x - 0.5*part, center.y);
        triangle(
          center.x - 1.5*part, center.y + 1*part,
          center.x + 0.5*part, center.y + 1*part,
          center.x - 0.5*part, center.y + 2*part);
        triangle(
          center.x + 0.5*part, center.y + 1*part,
          center.x + 2.5*part, center.y + 1*part,
          center.x + 1.5*part, center.y);
        triangle(
          center.x + 0.5*part, center.y + 1*part,
          center.x + 2.5*part, center.y + 1*part,
          center.x + 1.5*part, center.y + 2*part);
        triangle(
          center.x - 0.5*part, center.y,
          center.x + 1.5*part, center.y,
          center.x + 0.5*part, center.y + 1*part);


        //the muzzle
        triangle(
          center.x - 2.5*part, center.y,
          center.x - 0.5*part, center.y,
          center.x - 1.5*part, center.y - 1*part);
        triangle(
          center.x - 2.5*part, center.y,
          center.x - 0.5*part, center.y,
          center.x - 1.5*part, center.y + 1*part);

        //the tail
        triangle(
          center.x + 2.5*part, center.y + 1*part,
          center.x + 2.5*part, center.y - 1*part,
          center.x + 1.5*part, center.y);
        fill( 20, s, b );
        triangle(
          center.x + 1.5*part, center.y - 2*part,
          center.x + 2.5*part, center.y - 1*part,
          center.x + 1.5*part, center.y);

        //the ears
        triangle(
          center.x - 2.5*part, center.y - 2*part,
          center.x - 1.5*part, center.y - 1*part,
          center.x - 2.5*part, center.y);
        triangle(
          center.x - 0.5*part, center.y - 2*part,
          center.x - 1.5*part, center.y - 1*part,
          center.x - 0.5*part, center.y);

        //the paws
        triangle(
          center.x - 2.5*part, center.y + 2*part,
          center.x - 0.5*part, center.y + 2*part,
          center.x - 1.5*part, center.y + 1*part);
        triangle(
          center.x - 0.5*part, center.y + 2*part,
          center.x + 1.5*part, center.y + 2*part,
          center.x + 0.5*part, center.y + 1*part);
        part = size/12;

      break;

      case "fowl":
        part = size/6;

        fill( 60, s, b );
        //the head
        triangle(
          center.x - 2*part, center.y - 1*part,
          center.x - 1*part, center.y - 2*part,
          center.x, center.y - 1*part);

        //the neck
        triangle(
          center.x, center.y + 1*part,
          center.x - 1*part, center.y,
          center.x, center.y - 1*part);
        triangle(
          center.x - 1*part, center.y - 1*part,
          center.x - 1*part, center.y,
          center.x, center.y - 1*part);

        //the body
        triangle(
          center.x, center.y,
          center.x + 1*part, center.y + 1*part,
          center.x, center.y + 1*part);
        triangle(
          center.x, center.y,
          center.x + 1*part, center.y + 1*part,
          center.x + 2*part, center.y);


        fill( 20, s, b );
        //the paws
        triangle(
          center.x, center.y + 1*part,
          center.x - 1*part, center.y + 2*part,
          center.x, center.y + 2*part);
        triangle(
          center.x + 2*part, center.y + 1*part,
          center.x + 1*part, center.y + 1*part,
          center.x + 2*part, center.y + 2*part);
      break;

      case "mushroom":
        part = size/12;

        fill( 30, s, 240 );
        //the stipe
        triangle(
          center.x - 2*part, center.y + 4*part,
          center.x + 2*part, center.y + 4*part,
          center.x - 2*part, center.y + 2*part);
        triangle(
          center.x - 2*part, center.y + 2*part,
          center.x + 2*part, center.y + 4*part,
          center.x + 2*part, center.y + 2*part);


        fill( 0, s, 320 );
        //pileus
        triangle(
          center.x - 4*part, center.y + 2*part,
          center.x + 4*part, center.y + 2*part,
          center.x - 4*part, center.y + 0.5*part);
        triangle(
          center.x - 4*part, center.y + 0.5*part,
          center.x + 4*part, center.y + 2*part,
          center.x + 4*part, center.y + 0.5*part);
        triangle(
          center.x - 3*part, center.y + 0.5*part,
          center.x + 3*part, center.y + 0.5*part,
          center.x - 3*part, center.y - 1*part);
        triangle(
          center.x - 3*part, center.y - 1*part,
          center.x + 3*part, center.y + 0.5*part,
          center.x + 3*part, center.y - 1*part);
        triangle(
          center.x - 2*part, center.y - 1*part,
          center.x + 2*part, center.y - 1*part,
          center.x - 2*part, center.y - 2.5*part);
        triangle(
          center.x - 2*part, center.y - 2.5*part,
          center.x + 2*part, center.y - 1*part,
          center.x + 2*part, center.y - 2.5*part);
        triangle(
          center.x - 1*part, center.y - 2.5*part,
          center.x + 1*part, center.y - 2.5*part,
          center.x - 1*part, center.y - 4*part);
        triangle(
          center.x - 1*part, center.y - 4*part,
          center.x + 1*part, center.y - 2.5*part,
          center.x + 1*part, center.y - 4*part);
      break;

      case "cobblestone":
        fill( 180, 50, 320 );
        for( let i = 0.5; i < 8.5; i ++ )
          triangle(
            center.x, center.y,
            center.x + Math.sin( Math.PI*i/4 )*4*part, center.y + Math.cos( Math.PI*i/4 )*4*part,
            center.x + Math.sin( Math.PI*(i+1)/4 )*4*part, center.y + Math.cos( Math.PI*(i+1)/4 )*4*part);
      break;

      case "branch":
        stroke( 40, 200, 300 );
        strokeWeight( part*0.75 );
        //offshoots
        line(
          center.x - 0.25*part, center.y + 2*part,
          center.x - 1.5*part, center.y - 0.5*part, );
        line(
          center.x - 0.175*part, center.y - 1*part,
          center.x + 1*part, center.y - 4*part);

        //trunk
        line(
          center.x - 0.5*part, center.y + 4*part,
          center.x, center.y, );
        line(
          center.x - 0.5*part, center.y - 4*part,
          center.x, center.y, );
        strokeWeight( 1 );
      break;
    }
  }
}

//orange
/*for( let i = 0.5; i < 6.5; i ++ ){
  triangle(
    center.x, center.y,
    center.x + Math.sin( Math.PI*i/3 )*4*part, center.y + Math.cos( Math.PI*i/3 )*4*part,
    center.x + Math.sin( Math.PI*(i+1)/3 )*4*part, center.y + Math.cos( Math.PI*(i+1)/3 )*4*part);
}*/

/*fill( 20, s, b );
ellipse( center.x, center.y, 6*part, 6*part );

fill( 120, s, b );
triangle(
  center.x, center.y - 1*part,
  center.x, center.y - 2*part,
  center.x - 1*part, center.y - 2*part);

triangle(
  center.x - 1*part , center.y - 3*part,
  center.x, center.y - 2*part,
  center.x - 1*part, center.y - 2*part);*/

//block
/*
fill( 42, 180, 320 );
triangle(
  center.x - 2*part, center.y + 4*part,
  center.x - 2*part, center.y + 2*part,
  center.x + 4*part, center.y + 2*part);
triangle(
  center.x - 2*part, center.y + 2*part,
  center.x + 4*part, center.y + 2*part,
  center.x + 4*part, center.y);


fill( 42, 140, 320 );
triangle(
  center.x - 4*part, center.y,
  center.x - 2*part, center.y + 2*part,
  center.x - 4*part, center.y + 2*part);
triangle(
  center.x - 2*part, center.y + 4*part,
  center.x - 2*part, center.y + 2*part,
  center.x - 4*part, center.y + 2*part);

fill( 42, 100, 320 );
triangle(
  center.x - 4*part, center.y,
  center.x - 2*part, center.y + 2*part,
  center.x + 4*part, center.y);
triangle(
  center.x - 4*part, center.y,
  center.x + 2*part, center.y - 2*part,
  center.x + 4*part, center.y);
*/
