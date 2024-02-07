import * as THREE from 'three';
import gsap from 'gsap';
import * as Firework from '/firework.js';

const ratio = 4096/2907;
const scale = 4;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.addEventListener('pointerdown', (event) => {
    onPointerDown(event);
});

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
const materialCube = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometryCube, materialCube );
const clock = new THREE.Clock();

const fireworks = [];

const ambientLight = new THREE.AmbientLight( 0xffffff, 1.5 );
scene.add( ambientLight );

const light1 = new THREE.DirectionalLight( 0xffffff, 40 );
scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 50 );
scene.add( light2 );

let particleTexture = new THREE.TextureLoader().load( "particle.png" );
let particleMaterial = new THREE.SpriteMaterial( { map: particleTexture } );

const geometryPlane = new THREE.PlaneGeometry(  scale / ratio, scale );
const packetDiffuse = new THREE.TextureLoader().load( "old/diffuse.jpg" );
packetDiffuse.wrapS = THREE.RepeatWrapping;
packetDiffuse.wrapT = THREE.RepeatWrapping;

const packetBump = new THREE.TextureLoader().load( "old/bump.jpeg" );
packetBump.wrapS = THREE.RepeatWrapping;
packetBump.wrapT = THREE.RepeatWrapping;

const packetMetal = new THREE.TextureLoader().load( "old/metallic.jpg" );
packetMetal.wrapS = THREE.RepeatWrapping;
packetMetal.wrapT = THREE.RepeatWrapping;

const packetRoughness = new THREE.TextureLoader().load( "old/roughness.jpg" );
packetRoughness.wrapS = THREE.RepeatWrapping;
packetRoughness.wrapT = THREE.RepeatWrapping;

const packetMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff, 
    side: THREE.DoubleSide,
    map: packetDiffuse,
    bumpMap: packetBump,
    metalnessMap: packetMetal,
});

const cardMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff, 
    side: THREE.DoubleSide,
    bumpMap: packetBump,
    metalness: 0,
    roughness: 1,
});

const envelope = new THREE.Mesh( geometryPlane, packetMaterial );
scene.add( envelope );

const card = new THREE.Mesh( geometryPlane, cardMaterial );
scene.add( card );
card.position.z = -0.001;

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
    var xPos = scale * (Math.sin(2 * clock.getElapsedTime()));
    var yPos = scale * (Math.cos(2 * clock.getElapsedTime()));
    light1.position.set(xPos, yPos, 0.05);
    light2.position.set(-xPos, -yPos, 0.05);

    for (let i = 0; i < fireworks.length; i++) {
        let firework = fireworks[i];
        let deltaTime = 0.05;
        firework.render(deltaTime);
    
    }
    
	renderer.render( scene, camera );
}

var isAnimatingEnvelope = false;
var isAnimatingCard = false;

var isOut = false;

function createFirework () {

    fireworks.push(new Firework.Firework (
        new THREE.Vector3(0, 1.5 *  scale, -5), 
        scene, 
        particleMaterial
    ));
    
}

function onTapCard (event) {
    if (isOut) {
        let d = 0.1;
        gsap.to(card.position, {z: 0, duration: d, ease: "power1.out"});
        gsap.to(card.position, {z: -0.3, duration: d, ease: "power1.in", delay: d });
        createFirework();
    }
    
    
}

function onTapEnvelope (event) {
    if (isOut) {
        moveIn();
    }
    else{
        moveOut();
    }
    
}

function moveIn(){
    if (isAnimatingEnvelope) return;
    isAnimatingEnvelope = true;
    gsap.to(envelope.position, {z: 0, duration: 0.1});
    gsap.to(card.position, {
        y: 0,
        delay: 0.1,
        duration: 0.5,
    })
    gsap.to(envelope.position, {
        y: 0, 
        delay: 0.1,
        duration: 0.5, 
        onComplete: () => {
            isOut = false;
            isAnimatingEnvelope = false
        }
    });
}

function moveOut() {
    if (isAnimatingEnvelope) return;
    isAnimatingEnvelope = true;
    gsap.to(envelope.position, {z: 0.2, duration: 0.2});
    envelope.position.set(0, 0, 0);
    gsap.to(card.position, {
        y: scale * 1/ 8,
        delay: 0.2,
        duration: 1,
    })
    gsap.to(envelope.position, {
        y: -scale * 6/8, 
        delay: 0.2,
        duration: 1, 
        // ease: "power1.in", 
        onComplete: () => {
            isOut = true;
            isAnimatingEnvelope = false
        }
    });
}

function onPointerDown( event ) {
    
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
    // createFirework();
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children );

    for ( let i = 0; i < intersects.length; i ++ ) {
        if (intersects[ i ].object === envelope) {
            onTapEnvelope();
            break;
        }
        if (intersects[ i ].object === card) {
            onTapCard();
            break;
        }
	}

}

animate();