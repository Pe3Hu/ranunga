class Note {
  constructor ( index, txt, vec, hue, saturation, brightness, size, alignment ) {
    this.index = index ? index : null;
    this.txt = txt ? txt : "oups";
    this.vec = vec ? vec : createVector( canvasSize.x, canvasSize.y );
    this.hue = hue ? hue : 0;
    this.saturation = saturation ? saturation : 0;
    this.brightness = brightness ? brightness : 0;
    this.size = size ? size : 10;
    this.alignment = alignment ? alignment : CENTER;
  }

  draw(){
    /*let h = this.hue;
    let s = this.saturation;
    let b = this.brightness;
    fill( h, s, b );*/
    fill( 0 );
    text( this.txt, this.vec.x, this.vec.y );
  }
}
