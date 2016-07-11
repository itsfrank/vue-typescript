"use strict";
var DevUtils = (function () {
    function DevUtils() {
        this.decoratorComputedSum = 0;
        this.started = false;
        this.toggler = 0;
    }
    DevUtils.prototype.start = function () {
        this.started = true;
        this.globalStartTime = Date.now();
    };
    DevUtils.prototype.reportResult = function () {
        if (!this.started)
            throw 'Utility was never started, call .start() before your first import';
        else {
            console.log('vue-typescript preformance impact:');
            var totalTime = Date.now() - this.globalStartTime;
            console.log('\ttotal load time: ' + totalTime);
            console.log('\tvue-typescript computation time: ' + this.decoratorComputedSum);
            console.log('\tpercentage impact: ' + ((this.decoratorComputedSum / totalTime) * 100) + '%');
        }
    };
    DevUtils.prototype.decoratorStart = function () {
        if (!this.started)
            return;
        this.toggler += 1;
        this.decoratorStartTime = Date.now();
    };
    DevUtils.prototype.decoratorStop = function () {
        if (!this.started)
            return;
        this.toggler -= 1;
        this.decoratorComputedSum += (Date.now() - this.decoratorStartTime);
    };
    return DevUtils;
}());
exports.DevUtils = DevUtils;
exports.DeveloperUtils = new DevUtils();
//# sourceMappingURL=utils.js.map