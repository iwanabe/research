
var container, scene, camera, renderer, controls, stats;

window.onload = main;

function main(){
	//SCENE
	scene = new THREE.Scene();
	
	//CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
	camera.position.z = 1000;
	
	scene.add( camera );
	
	//RENDERER
	if (Detector.webgl) {
	renderer = new THREE.WebGLRenderer({antialias:true});
	} else {
	renderer = new THREE.CanvasRenderer(); 
	}
	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0xffffff);
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
	loader.load( 'model/samurai_64.stl', function ( geometry ) {
//		geometry.mergeVertices(); //it calls error
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();
		
		 var colorMaterial =  new THREE.MeshPhongMaterial(
		{color: 0x7f7f7f, 
		 side: THREE.FrontSide,
		 shading: THREE.SmoothShading,
		 wireframe: false} );
		
		mesh = new THREE.Mesh( geometry, colorMaterial );
		
		var menu = new function(){
			this.color = colorMaterial.color.getStyle();
			this.wireframe = colorMaterial.wireframe;
		}
		
		//GUI
		if(!Detector.webgl)Detector.addGetWebGLMessage();
		var gui = new dat.GUI();
		
		gui.addColor(menu, 'color').onChange(function(e){
			colorMaterial.color.setStyle(e)
		});
		gui.add(menu, 'wireframe').onChange(function (e) {
			colorMaterial.wireframe = e
		});
		
		scene.add( mesh );
		
		//Controls
		controls = new THREE.OrbitControls( camera,renderer.domElement);
		animate();
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