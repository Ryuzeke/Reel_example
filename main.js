const app = new PIXI.Application({
    resizeTo: window
});

var resize = ()=> {
    var ratio = Math.min(window.innerWidth/200,window.innerHeight/700);
    app.stage.scale.x = app.stage.scale.y = ratio;
}
this.resize();
window.addEventListener("resize", resize.bind(this));



document.body.appendChild(app.view);

// generate a reels group container to add mask and reels
var reelsGroup = new PIXI.Container();
reelsGroup.y = -130
app.stage.addChild(reelsGroup);

// generate mask and add it on reels group
var maskRect = new PIXI.Graphics();
maskRect.beginFill(0x0000);
maskRect.drawRect(0, 170, 200, 530);
maskRect.isMask = true;
reelsGroup.addChild(maskRect)
reelsGroup.mask = maskRect;


// generate reelInstace and add it on reel
var reelInstance = new Reel();
reelsGroup.addChild(reelInstance.container);



// generate start button
const style = new PIXI.TextStyle({
    fill: "white"
});
var start = new PIXI.Text('Start', style);
start.x = 50
start.y = 600
start.interactive = true;
start.buttonMode  = true;
start.click = ()=>{
    reelInstance.spin()
}
app.stage.addChild(start)

// generate fps information
var FPS = new PIXI.Text('', style);
FPS.x = 50
FPS.y = 10
FPS.text = "FPS:" + ~~PIXI.Ticker.shared.FPS
setInterval(() => {
    FPS.text = "FPS:" + ~~PIXI.Ticker.shared.FPS
}, 1000);
app.stage.addChild(FPS)

var particle = new Particle(app);
app.stage.addChild(particle);
reelInstance.onStop = ()=>{
    particle.stop();
    particle.play();
}







