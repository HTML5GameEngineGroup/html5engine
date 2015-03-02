//
//
function CameraState(center, width)
{
    this._kCycles = 300;  // number of cycles to complete the transition
    this._kRate = 0.1;  // rate of change for each cycle
    this._mCenter = new InterpolateVec2(center, this._kCycles, this._kRate);
    this._mWidth = new Interpolate(width, this._kCycles, this._kRate);
};

// <editor-fold desc="Public Methods">
CameraState.prototype.GetCenter = function() { return this._mCenter.GetValue(); };
CameraState.prototype.GetWidth = function() { return this._mWidth.GetValue(); };

CameraState.prototype.SetCenter = function(c) { this._mCenter.SetFinalValue(c); };
CameraState.prototype.SetWidth = function(w) { this._mWidth.SetFinalValue(w); };

CameraState.prototype.UpdateCameraState = function() { 
    this._mCenter.UpdateInterpolation();
    this._mWidth.UpdateInterpolation();
};
// </editor-fold>