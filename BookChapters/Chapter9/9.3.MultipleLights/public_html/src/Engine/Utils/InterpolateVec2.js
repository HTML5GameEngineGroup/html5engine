// vec2 interpolation support
function InterpolateVec2(value, cycle, rate) {
    Interpolate.call(this, value, cycle, rate);
};
gEngine.Core.InheritPrototype(InterpolateVec2, Interpolate);

InterpolateVec2.prototype._InterpolateValue = function() { 
    vec2.lerp(this._mCurrentValue, this._mCurrentValue, this._mFinalValue, this._mRate);
};