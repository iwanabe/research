// standard global variables
var container, scene, camera, renderer, controls, stats;
var dataUrl;
var gui;

var filename = '3dkanjimodel';

let meanCurvatureFlow = undefined;
let modifiedMeanCurvatureFlow = undefined;
let h = 0.002;
let threeMesh = undefined;
let memoryManager = new EmscriptenMemoryManager();
let showWireframe = false;

window.onload = main;

// The main function: init everything and animate everything
function main() {
	//input image file
	var objfile = document.getElementById("selfile");
	objfile.addEventListener("change", function(evt) {
		dataUrl = URL.createObjectURL(objfile.files[0]);
		
		//
		//getfilename
		var a = objfile.files[0].name;
		var b = a.indexOf(".");
		
		if(b < 0){
			//console.log(a);
		}
		else //console.log(a.substring(0,b));
		filename = a.substring(0,b)
		
		
		console.time('process time: ');
		AllProcessing();
	},false);
}


//processing in order
AllProcessing = function(){
	var canvas = document.getElementById('mycanvas');
	if(canvas.getContext){
		var context = canvas.getContext('2d');
		var img = new Image();
		img.src = dataUrl;
		img.addEventListener('load',function(){
			LoadImageAndGetContour(img); //model.js
			console.log("please wait");
			init();
			animate();
			exportToObj(); //ObjProcessing.js
			console.timeEnd('process time: ');
		},false);
	}
}


// The grid resolution: res * res * res
var grid_resolution = 64;

// Init a regular grid, sample the model,
// Generate a mesh using the Marching Cubes algorithm 
// for the sampled model.
// And set the ThreeJS renderer to render the mesh.
function init() {
	// Domain bounding box
	var bbox = model.boundingBox();
	var x_min = bbox["x_min"];
	var x_max = bbox["x_max"];
	var y_min = bbox["y_min"];
	var y_max = bbox["y_max"];
	var z_min = bbox["z_min"];
	var z_max = bbox["z_max"];
	
	var x_range = x_max - x_min;
	var y_range = y_max - y_min;
	var z_range = z_max - z_min;
	
	// SCENE
	scene = new THREE.Scene();
	
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	scene.add(camera);
	
	camera.position.set(2.5, 2.5, 2.5);
//	camera.position.set(x_max + 0.5*x_range, 
//			y_max + 0.5*y_range, 
//			z_max + 0.5*z_range);
	camera.lookAt(scene.position);	
	
	
	// RENDERER
	if (Detector.webgl) {
	renderer = new THREE.WebGLRenderer({antialias:true});
	} else {
	renderer = new THREE.CanvasRenderer(); 
	}
	
	//new
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	//renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	renderer.setClearColor(0xffffff);
	container = document.getElementById('ThreeJS');
	container.appendChild(renderer.domElement);
	
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	
	// CONTROLS
	//controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls = new THREE.TrackballControls(camera, renderer.domElement);
	controls.rotateSpeed = 5.0;
	
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild(stats.domElement);
	
	// lights
//	var light1 = new THREE.DirectionalLight(0xffffff);
//	light1.position.set(0,1,0);
//	scene.add(light1);
	
//	var light2 = new THREE.DirectionalLight(0xffffff);
//	light2.position.set(1,0,0);
//	scene.add(light2);
	
//	var light3 = new THREE.DirectionalLight(0xffffff);
//	light3.position.set(0,0,1);
//	scene.add(light3);
	
//	var light4 = new THREE.DirectionalLight(0xffffff);
//	light4.position.set(0,-1,0);
//	scene.add(light4);
	
//	var light5 = new THREE.DirectionalLight(0xffffff);
//	light5.position.set(-1,0,0);
//	scene.add(light5);
	
//	var light6 = new THREE.DirectionalLight(0xffffff);
//	light6.position.set(0,0,-1);
//	scene.add(light6);

	initLights();
	
//	scene.add( new THREE.AxisHelper(100) );
	
	// Add the polygonized implicit to the scene
//	var mesh = MC.polygonize(model, grid_resolution);
//	mesh.rotateY(Math.PI);
//	mesh.rotateZ(-Math.PI);
//	mesh.translateX(-x_range/2.0);
//	mesh.translateY(-y_range/2.0);
//	mesh.translateZ(-z_range/2.0);
	
//	scene.add(mesh);

	//Name is changed mesh to threeMesh
	threeMesh = MC.polygonize(model, grid_resolution);
	threeMesh.rotateY(Math.PI);
	threeMesh.rotateZ(-Math.PI);
	threeMesh.translateX(-x_range/2.0);
	threeMesh.translateY(-y_range/2.0);
	threeMesh.translateZ(-z_range/2.0);
	
	scene.add(threeMesh);
	
	
	//GUI
	gui = new dat.GUI();
	
	var menu = new function(){
		this.ExportSTL = function(){
			var objString = MeshIO.writeSTL({
				"v": positions,
				"vt": uvs,
				"vn": normals,
				"f": indices
			});
			var blob = new Blob([objString], {type: 'text/plain'});
			saveAs(blob, filename + '.stl');
		};
		this.ExportOBJ = function(){
			var objString = MeshIO.writeOBJ({
				"v": positions,
				"vt": uvs,
				"vn": normals,
				"f": indices
			});
			var blob = new Blob([objString], {type: 'text/plain'});
			saveAs(blob, filename + '.obj');
		};
		this.timeStep = h;
		this.integrate = function(){
			meanCurvatureFlow.integrate(h);
			memoryManager.deleteExcept([modifiedMeanCurvatureFlow.A]);
			updateMesh();
		};
		this.wireframe = showWireframe;
	}
	gui.add(menu,'ExportSTL');
	gui.add(menu,'ExportOBJ');
	gui.add(menu,'timeStep',0.001,0.1).step(0.001).onChange(updateTimeStep).listen();
	gui.add(menu,'integrate');
	gui.add(menu,'wireframe').onChange(toggleWireframe).listen();
	
	
	// add a grid to help position each object
	//var grid = new THREE.GridHelper(500, 25);
	//scene.add(grid);
}

function initLights()
{
	let ambient = new THREE.AmbientLight(0xffffff, 0.35);
	camera.add(ambient);
	
	let point = new THREE.PointLight(0xffffff);
	point.position.set(2, 20, 15);
	camera.add(point);
	
	scene.add(camera);
}

function updateTimeStep(value)
{
	h = value;
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

function render()
{
	renderer.render( scene, camera );
}