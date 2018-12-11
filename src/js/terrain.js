class Terrain{
  constructor ( type, color, hue ) {
    this.type = type ? type : null;
    this.color = color ? color : 192;
    this.hue = hue ? hue : 0;
    this.biomeIndex = null;
    this.biomeSize = null;
    this.default = true;
    this.feature = false;
  }

  setFeature( a ){
    this.abundance = a;
    this.feature = true;
  }
}
