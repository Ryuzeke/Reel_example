const PHASES = {
    IDLE: 1,
    SPINNING: 2,
    STOPPING: 3
}
var ticker = PIXI.Ticker.shared;
class Reel {
    constructor() {
        this.stripe = [1,1,2,3,4,4,1,2,4,4,1,2];
        this.currentStripeIndex = 0;
        this.columns = 3;
        this.symbolsHeight = 175;
        this.container = new PIXI.Container();
        this.phase = PHASES.IDLE
        this.containerOriginalHeight = null
        this.timePassed = null
        this.speed = 70;
        this.init();
        this.timeUntilStopSpin = 3000
        this.onStop = null;
        ticker.add(this.update.bind(this));
    }

    spin(){
        if(this.phase !== PHASES.IDLE) return;
        this.phase = PHASES.SPINNING
        setTimeout(() => {
            this.stop();
        }, this.timeUntilStopSpin);
    }


    decreaseStripeIndex(){
        if(this.stripe[this.currentStripeIndex-1]){
            this.currentStripeIndex = this.currentStripeIndex-1;
        } else {
            this.currentStripeIndex = this.stripe.length-1;
        }
    }

    update(){
        if(this.phase == PHASES.IDLE) return;
        this.timePassed += ticker.elapsedMS;
        while (this.timePassed >= PIXI.settings.TARGET_FPMS) {
            this.container.y += this.speed * PIXI.settings.TARGET_FPMS;
            this.timePassed -= ticker.elapsedMS;
        }
        if(this.container.y > this.containerOriginalHeight){
            this.container.y = 0;
            this.decreaseStripeIndex();
            this.pushNextSymbol()
            this.validateSymbolPositions();
            if(this.phase === PHASES.STOPPING){
                this.phase = PHASES.IDLE
                if(typeof this.onStop === 'function'){
                    this.onStop();
                }
            }
        }
    }

    stop(){
        if(this.phase !== PHASES.SPINNING) return;
        this.phase = PHASES.STOPPING
    }

    pushNextSymbol(){
        var currentSymbols = this.getSymbolsBasedOnStripeIndex(this.currentStripeIndex)
        var newSymbol = currentSymbols[0];
        var symbolSprite = PIXI.Sprite.from('assets/symbols/'+newSymbol+'.png')
        var positionOfLast = this.container.children.length-1;
        this.container.removeChildAt(positionOfLast);
        this.container.addChildAt(symbolSprite,0)
    }

    validateSymbolPositions(){
        this.container.children.forEach((symbolSprite, index) => {
            symbolSprite.y = this.symbolsHeight * index
        });
    }

    init(){
        var symbols = this.getSymbolsBasedOnStripeIndex(this.currentStripeIndex);
        for(var symbolId of symbols){
            var symbolSprite = PIXI.Sprite.from('assets/symbols/'+symbolId+'.png')
            symbolSprite.y = this.symbolsHeight*this.container.children.length
            this.container.addChild(symbolSprite)
        }
        this.containerOriginalHeight =  this.container.y + (this.columns+1 * this.symbolsHeight) 
    }


    getSymbolsBasedOnStripeIndex(stripeIndex){
        let symbols = []
        let iGoneFromStartAtIndex = null;
        for(var i = this.columns-1; i >= 0; i--){
            let position = stripeIndex+i;
            if(this.stripe[position]){
                symbols.push(this.stripe[position])
            } else {
                if(iGoneFromStartAtIndex === null){
                    iGoneFromStartAtIndex = 1;
                }
                position = i-iGoneFromStartAtIndex;
                symbols.push(this.stripe[position])
            }
            if(i == 0){ 
                // i put one symbol on top of three columns symbol because when reel spins i need
                // to see the up coming before removing symbol from bottom
                let symbolFromTop = this.stripe[position-1] || this.stripe[this.stripe.length-1]
                symbols.push(symbolFromTop);
            }
        }
        return symbols;
    }
}