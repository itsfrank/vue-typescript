export class DevUtils {
    private globalStartTime: number;
    private decoratorStartTime:number;
    private decoratorComputedSum:number = 0;

    private started:boolean = false;
    private toggler:number = 0;

    public start(){
        this.started = true;
        this.globalStartTime = Date.now();
    }

    public reportResult(){
        if (!this.started) throw 'Utility was never started, call .start() before your first import';
        else {
            console.log('vue-typescript preformance impact:');
            var totalTime = Date.now() - this.globalStartTime;
            console.log('\ttotal load time: ' + totalTime);
            console.log('\tvue-typescript computation time: ' + this.decoratorComputedSum);
            console.log('\tpercentage impact: ' + ((this.decoratorComputedSum / totalTime) * 100) + '%');
        }
    }

    public decoratorStart(){
        if (!this.started) return;
        this.toggler += 1;
        this.decoratorStartTime = Date.now();
    }

    public decoratorStop(){
        if (!this.started) return;
        this.toggler -= 1;
        this.decoratorComputedSum += (Date.now() - this.decoratorStartTime);
    }
}

export var DeveloperUtils = new DevUtils(); 