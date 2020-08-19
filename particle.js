class Particle extends PIXI.ParticleContainer{
    constructor(app){
        super();
        this.app = app;
        // hardcode

        this.emitter = new PIXI.particles.Emitter(app.stage,[PIXI.Texture.from('assets/smokeparticle.png')],{
            "alpha": {
                "start": 0.74,
                "end": 0
            },
            "scale": {
                "start": 5,
                "end": 1.2,
                "minimumScaleMultiplier": 1
            },
            "color": {
                "start": "#ffdfa0",
                "end": "#100f0c"
            },
            "speed": {
                "start": 700,
                "end": 0,
                "minimumSpeedMultiplier": 1
            },
            "acceleration": {
                "x": 0,
                "y": 0
            },
            "maxSpeed": 0,
            "startRotation": {
                "min": 0,
                "max": 360
            },
            "noRotation": false,
            "rotationSpeed": {
                "min": 0,
                "max": 200
            },
            "lifetime": {
                "min": 0.5,
                "max": 1
            },
            "blendMode": "normal",
            "ease": [
                {
                    "s": 0,
                    "cp": 0.329,
                    "e": 0.548
                },
                {
                    "s": 0.548,
                    "cp": 0.767,
                    "e": 0.876
                },
                {
                    "s": 0.876,
                    "cp": 0.985,
                    "e": 1
                }
            ],
            "frequency": 0.001,
            "emitterLifetime": 0.1,
            "maxParticles": 100,
            "pos": {
                "x": 75,
                "y": 350
            },
            "addAtBack": true,
            "spawnType": "point"
        });
        this.stop();
        this.elapsed = Date.now();
        var update = ()=> {
            requestAnimationFrame(update);
            var now = Date.now();
            this.emitter.update((now - this.elapsed) * 0.001);
            this.elapsed  = now;
            this.app.renderer.render(this.app.stage);
        }
        update();
    }


    stop(){
        this.emitter.emit = false;
    }
    
    play(){
        this.emitter.emit = true;
    }
}