import * as THREE from 'three';

const ratio = 4096/2907;
const scale = 4;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometryCube = new THREE.BoxGeometry( 1, 1, 1 );
const materialCube = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometryCube, materialCube );
//scene.add( cube );
var clock = new THREE.Clock();

const ambientLight = new THREE.AmbientLight( 0xffffff, 2 );
scene.add( ambientLight );

// const light1 = new THREE.PointLight( 0xffffff, 3 );
// light1.position.set( 0, 1, 0 );
// scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 40 );
scene.add( light2 );

const light3 = new THREE.DirectionalLight( 0xffffff, 50 );
scene.add( light3 );



const geometryPlane = new THREE.PlaneGeometry(  scale / ratio, scale );
const cardDiffuse = new THREE.TextureLoader().load( "public/old/diffuse.jpg" );
cardDiffuse.wrapS = THREE.RepeatWrapping;
cardDiffuse.wrapT = THREE.RepeatWrapping;

const cardBump = new THREE.TextureLoader().load( "public/old/bump.jpeg" );
cardBump.wrapS = THREE.RepeatWrapping;
cardBump.wrapT = THREE.RepeatWrapping;

const cardMetal = new THREE.TextureLoader().load( "public/old/metallic.jpg" );
cardMetal.wrapS = THREE.RepeatWrapping;
cardMetal.wrapT = THREE.RepeatWrapping;

const cardRoughness = new THREE.TextureLoader().load( "public/old/roughness.jpg" );
cardRoughness.wrapS = THREE.RepeatWrapping;
cardRoughness.wrapT = THREE.RepeatWrapping;

const materialPlane = new THREE.MeshStandardMaterial( {
    color: 0xffffff, 
    side: THREE.DoubleSide,
    map: cardDiffuse,
    bumpMap: cardBump,
    metalnessMap: cardMetal,
});
const plane = new THREE.Mesh( geometryPlane, materialPlane );
scene.add( plane );

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );

    var xPos = scale * (Math.sin(2 * clock.getElapsedTime()));
    var yPos = scale * (Math.cos(2 * clock.getElapsedTime()));
    // console.log(xPos, yPos);
    light2.position.set(xPos, yPos, 0.05);
    light3.position.set(-xPos, -yPos, 0.05);
	// plane.rotation.x += 0.01;
	// plane.rotation.x += 0.01;

	renderer.render( scene, camera );
}

(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
    var eventDoc, doc, body;

    event = event || window.event; // IE-ism

    // If pageX/Y aren't available and clientX/Y are,
    // calculate pageX/Y - logic taken from jQuery.
    // (This is to support old IE)
    if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
    }
    var percentX = event.pageX / window.innerWidth;
    var percentY = 1 - event.pageY / window.innerHeight;
    var xPos =  -scale + 2 * scale * percentX;
    var yPos = -scale + 2 * scale * percentY;
    // light2.position.set(xPos, yPos, 0.1);
    // light3.position.set(-xPos, -yPos, 0.1);
    //light1.position.set(new THREE.Vector3(0, 1, 0));

}
})();


animate();