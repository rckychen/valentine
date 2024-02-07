import * as Physics from '/physics.js';
import * as THREE from 'three';

export class Football {
    constructor(startingPosition, scene, prefab) {
        this.lifeSpan = 1.5;
        this.clock = new THREE.Clock();
        this.scene = scene;
        this.startingPosition = startingPosition;
        this.particleCount = 10;
        this.physics = [];
        this.footballs = [];
        for (let i = 0; i < this.particleCount; i++ ){
            let randomDirection = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5,
            ).multiplyScalar(10);
            let football = prefab.clone();
            let gravityVector = new THREE.Vector3(0, -8, 0);
            let physics = new Physics.Physics (this.startingPosition.clone(), randomDirection, 1);
            physics.acceleration = gravityVector;
            this.physics.push(physics);
            this.footballs.push(football);
            scene.add(football);
        }
    }
    render (deltaTime) {
        for (let i = 0; i < this.particleCount; i++) {
            this.physics[i].step(deltaTime);
            this.footballs[i].position.set(
                this.physics[i].position.x, 
                this.physics[i].position.y, 
                this.physics[i].position.z,
            );
            // var newDir = this.physics[i].velocity.clone();
            var newDir = new THREE.Vector3(
                -this.physics[i].velocity.x,
                this.physics[i].velocity.z,
                this.physics[i].velocity.y,
            )
            var pos = this.footballs[i].position.clone();
            
            pos.addVectors(newDir, this.physics[i].position);
            this.footballs[i].lookAt(pos);
            // let scale =(1 - (this.clock.getElapsedTime() / this.lifeSpan));
            // this.footballs[i].scale.set(
            //     scale,scale,scale
            // )

        }
        if (this.clock.getElapsedTime() > this.lifeSpan) {
            this.destroy();
        }
    }

    destroy () {
        for (let i = 0; i < this.particleCount; i++) {
            this.scene.remove( this.footballs[i] );
        }
    }
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}