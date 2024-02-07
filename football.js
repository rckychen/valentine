import * as Physics from '/physics.js';
import * as THREE from 'three';

export class Football {
    constructor(startingPosition, scene, prefab) {
        this.lifeSpan = 1.5;
        this.clock = new THREE.Clock();
        this.scene = scene;
        this.startingPosition = startingPosition;
        this.particleCount = 5;
        this.physics = [];
        this.footballs = [];
        for (let i = 0; i < this.particleCount; i++ ){
            let randomDirection = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                (Math.random() - 0.5) * 0.2,
            ).multiplyScalar(4);
            let randomRotation = new THREE.Vector3(
                Math.random() * 2 * Math.PI,
                Math.random() * 2 * Math.PI,
                Math.random() * 2 * Math.PI,
            )
            let football = prefab.clone();
            football.rotation.x = Math.random() * 2 * Math.PI;
            football.rotation.y = Math.random() * 2 * Math.PI;
            football.rotation.z = Math.random() * 2 * Math.PI;
            
            let gravityVector = new THREE.Vector3(0, -1, 0);
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
            let scale = 0.05 * Math.min( 2 * (this.clock.getElapsedTime() / this.lifeSpan), 1);
            this.footballs[i].scale.set(scale, scale,scale);

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