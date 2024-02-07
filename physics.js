
import * as THREE from 'three';

export class Physics {
    constructor(position, velocity, mass) {
        this.acceleration = new THREE.Vector3();
        this.position = position;
        this.velocity = velocity;
        this.mass = mass; //not used

    }

    step (deltaTime) {
        // v = v + a * dt; 
        // p = p + v * dt;
        // euler

        this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

    }
  }