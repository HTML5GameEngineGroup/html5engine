
// value: target for interpolation
// cycles: integer, how many cycle it should take for a value to change to final
// rate: the rate at which the value should change at each cycle
function Interpolate(value, cycles, rate) {
    this._mCurrentValue = value;    // begine value of interpolation
    this._mFinalValue = value;      // final value of interpolation
    this._mCycles = cycles;
    this._mRate = rate;
    
    // if there is a new value to interpolate to, these are the currnet state
    this._mCurrentCycle = 0;    
};

// <editor-fold desc="Public Methods">
Interpolate.prototype.GetValue = function() { return this._mCurrentValue; };
Interpolate.prototype.SetFinalValue = function(v) { 
    this._mFinalValue = v; 
    this._mCurrentCycle = this._mCycles;     // will trigger interpolation
};

Interpolate.prototype.UpdateInterpolation = function() { 
    if (this._mCurrentCycle <= 0)
        return;
    
    this._mCurrentCycle--;
    if (this._mCurrentCycle === 0) {
        this._mCurrentValue = this._mFinalValue;
    } else {
        this._InterpolateValue();
    }
};

// stiffness of 1 switches off interpolation
Interpolate.prototype.ConfigInterpolation = function(stiffness, duration) { 
    this._mRate = stiffness;
    this._mCycles = duration;
};
// </editor-fold>

// subclass should override this function for non-scalar values
Interpolate.prototype._InterpolateValue = function() { 
    this._mCurrentValue = this._mCurrentValue + this._mRate * (this._mFinalValue - this._mCurrentValue);
};