
var container, scene, camera, renderer, controls, stats;

let meanCurvatureFlow = undefined;
let modifiedMeanCurvatureFlow = undefined;
let h = 0.002;
let threeMesh = undefined;
let memoryManager = new EmscriptenMemoryManager();
let showWireframe = false;

window.onload = main;

function main(){
	//SCENE
	scene = new THREE.Scene();
	
	//CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.z = 10;
	
//	const fov = 45.0;
//			const aspect = window.innerWidth / window.innerHeight;
//			const near = 0.1;
//			const far = 1000;
//			const eyeZ = 3.5;
//
//			camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//			camera.position.z = eyeZ;
	
	scene.add( camera );
	
	//RENDERER
	if (Detector.webgl) {
	renderer = new THREE.WebGLRenderer({antialias:true});
	} else {
	renderer = new THREE.CanvasRenderer(); 
	}
	
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
//	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0x000000,1.0)//(0xffffff);
	container = document.getElementById('ThreeJS');
	container.appendChild(renderer.domElement);
	
	//EVENTS
	THREEx.WindowResize(renderer, camera);
	
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);
	
	//LIGHTS
	var light1 = new THREE.DirectionalLight(0xffffff);
	light1.position.set(0,1,0);
	scene.add(light1);
	
	var light2 = new THREE.DirectionalLight(0xffffff);
	light2.position.set(1,0,0);
	scene.add(light2);
	
	var light3 = new THREE.DirectionalLight(0xffffff);
	light3.position.set(0,0,1);
	scene.add(light3);
	
	var light4 = new THREE.DirectionalLight(0xffffff);
	light4.position.set(0,-1,0);
	scene.add(light4);
	
	var light5 = new THREE.DirectionalLight(0xffffff);
	light5.position.set(-1,0,0);
	scene.add(light5);
	
	var light6 = new THREE.DirectionalLight(0xffffff);
	light6.position.set(0,0,-1);
	scene.add(light6);
	
	//3D MODEL Preparations
	var loader = new THREE.STLLoader();
	var geometry2 = new THREE.Geometry();
	loader.load( 'model/samurai_64.stl', function ( geometry2 ) {
	

		
//	var loader = new THREE.OBJLoader();
//	loader.load( 'model/b.obj', function (object) {
	//	geometry2.mergeVertices(); //it calls error
		geometry2.computeFaceNormals();
		geometry2.computeVertexNormals();
		
		 var colorMaterial =  new THREE.MeshPhongMaterial(
		{color: 0x7f7f7f, 
		 side: THREE.FrontSide,
		 flatShading: false,
		 wireframe: false
		 });
		
		threeMesh = new THREE.Mesh( geometry2, colorMaterial );
		
		
		
		var menu = new function(){
			this.integrate = function(){
				meanCurvatureFlow.integrate(h);
				memoryManager.deleteExcept([modifiedMeanCurvatureFlow.A]);
				updateMesh();
			};
		}
		
		//GUI
		if(!Detector.webgl)Detector.addGetWebGLMessage();
		var gui = new dat.GUI();
		
		gui.add(menu,'integrate');
		
		scene.add( threeMesh );
		
		//Controls
		//controls = new THREE.OrbitControls( camera,renderer.domElement);
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.rotateSpeed = 5.0;
		
		animate();
		exportToObj();
	});
}

function animate()
{
	requestAnimationFrame( animate );
	render();
	update();
}
function update()
{	
	controls.update();
	stats.update();
}

render=function()
{
	renderer.render( scene, camera );
}