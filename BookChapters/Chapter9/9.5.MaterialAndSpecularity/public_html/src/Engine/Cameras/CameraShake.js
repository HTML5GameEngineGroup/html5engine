//
// dampped simple harmonic shake motion
//
// state is the CameraState to be shaked.
function CameraShake(state, xDelta, yDelta, shakeFrequency, shakeDuration) {    
    this._mOrgCenter = vec2.clone(state.GetCenter());
    this._mShakeCenter = vec2.clone(this._mOrgCenter);
    this._mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
};

CameraShake.prototype.UpdateShakeState = function() {
    var s = this._mShake.GetShakeResults();
    vec2.add(this._mShakeCenter, this._mOrgCenter, s);
};

CameraShake.prototype.ShakeDone = function() { 
    return this._mShake.ShakeDone();
};

CameraShake.prototype.GetCenter = function() { return this._mShakeCenter; };
CameraShake.prototype.SetRefCenter = function(c) { 
    this._mOrgCenter[0] = c[0];
    this._mOrgCenter[1] = c[1];
};