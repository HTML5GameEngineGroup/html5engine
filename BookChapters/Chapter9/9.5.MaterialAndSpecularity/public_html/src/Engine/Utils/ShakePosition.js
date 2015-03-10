//
// dampped simple harmonic shake motion
// xDelta, yDelta: how large a shake
// shakeFrequency: how much movement
// shakeDuration: for how long
//
function ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration)
{    
    this._mXMag = xDelta;
    this._mYMag = yDelta;
    
    this._mCycles = shakeDuration; // number of cycles to complete the transition
    this._mOmega = shakeFrequency * 2 * Math.PI; // 
    
    this._mNumCyclesLeft = shakeDuration;
};

ShakePosition.prototype.ShakeDone = function() { 
    return (this._mNumCyclesLeft <= 0);
};

ShakePosition.prototype.GetShakeResults = function() { 
    this._mNumCyclesLeft--;
    var c = [];
    var f = 0;
    if (!this.ShakeDone())
        f = this._f();
    c[0] = this._mXMag * f;
    c[1] = this._mYMag * f;
    return c;
};

ShakePosition.prototype._f = function() { 
  // computes (Cycles) * cos(  Omega * t )
  var frac = this._mNumCyclesLeft / this._mCycles;
  var sign = -1;
  if (Math.random() > 0.5) 
      sign = 1;
  return  sign * frac*frac * Math.cos( (1-frac) * this._mOmega);
};