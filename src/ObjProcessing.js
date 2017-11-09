
function exportToObj(){
	var exporter = new THREE.OBJExporter();
	var objString = exporter.parse(scene);
	
	//console.log(objString);
	//initMesh(samurai);
	initMesh(objString);
	
}

function ConvertStlToObj(){

}

//
//copy part from geometry-flow/index.html
//

let mesh = undefined;
const ORANGE = new Vector(1.0, 0.5, 0.0);
let geometry = undefined;

function initMesh(text) {
	let polygonSoup = MeshIO.readOBJ(text);
	mesh = new Mesh();
	if (mesh.build(polygonSoup)) {
		// remove any previously loaded mesh from scene
		scene.remove(threeMesh);
		memoryManager.deleteExcept([]);

		// create geometry object
		geometry = new Geometry(mesh, polygonSoup["v"]);
	
		// create a THREE.js mesh (and geometry) object
		initThreeMesh();
		scene.add(threeMesh);

		// initialize mean curvature flows
		meanCurvatureFlow = new MeanCurvatureFlow(geometry);
		modifiedMeanCurvatureFlow = new ModifiedMeanCurvatureFlow(geometry);

		// update metadata
//		let element = document.getElementById("meta");
//		element.textContent = "";

		} else {
			alert("Unable to build halfedge mesh");
		}
}

function initThreeMesh() {
	// create geometry object
	threeGeometry = new THREE.BufferGeometry();

	// fill position, normal and color buffers
	let V = mesh.vertices.length;
	positions = new Float32Array(V * 3);
	normals = new Float32Array(V * 3);
	colors = new Float32Array(V * 3);
	for (let v of mesh.vertices) {
		let i = v.index;

		let position = geometry.positions[v];
		positions[3 * i + 0] = position.x;
		positions[3 * i + 1] = position.y;
		positions[3 * i + 2] = position.z;

		let normal = geometry.vertexNormalEquallyWeighted(v);
		normals[3 * i + 0] = normal.x;
		normals[3 * i + 1] = normal.y;
		normals[3 * i + 2] = normal.z;

		colors[3 * i + 0] = ORANGE.x;
		colors[3 * i + 1] = ORANGE.y;
		colors[3 * i + 2] = ORANGE.z;
	}

	// fill index buffer
	let F = mesh.faces.length;
	indices = new Uint32Array(F * 3);
	for (let f of mesh.faces) {
		let i = 0;
		for (let v of f.adjacentVertices()) {
			indices[3 * f.index + i++] = v.index;
		}
	}

	// set geometry
	threeGeometry.setIndex(new THREE.BufferAttribute(indices, 1));
	threeGeometry.addAttribute("position", new THREE.BufferAttribute(positions, 3));
	threeGeometry.addAttribute("normal", new THREE.BufferAttribute(normals, 3));
	threeGeometry.addAttribute("color", new THREE.BufferAttribute(colors, 3));

	// create material
	let threeMaterial = new THREE.MeshPhongMaterial({
		vertexColors: THREE.VertexColors,
		polygonOffset: true,
		polygonOffsetFactor: 1,
		polygonOffsetUnits: 1,
		side: THREE.DoubleSide
	});

	// create wireframe
	wireframe = new THREE.LineSegments();
	wireframe.geometry = new THREE.WireframeGeometry(threeGeometry);
	wireframe.material = new THREE.LineBasicMaterial({
		color: 0x000000,
		linewidth: 0.75
	});

	// create mesh
	threeMesh = new THREE.Mesh(threeGeometry, threeMaterial);

	// toggle wireframe
	toggleWireframe(showWireframe);
}

function updateMesh() {
	for (let v of mesh.vertices) {
		let i = v.index;

		let position = geometry.positions[v];
		positions[3 * i + 0] = position.x;
		positions[3 * i + 1] = position.y;
		positions[3 * i + 2] = position.z;

		let normal = geometry.vertexNormalEquallyWeighted(v);
		normals[3 * i + 0] = normal.x;
		normals[3 * i + 1] = normal.y;
		normals[3 * i + 2] = normal.z;
	}

	threeGeometry.attributes.position.needsUpdate = true;
	threeGeometry.attributes.normal.needsUpdate = true;
	wireframe.geometry = new THREE.WireframeGeometry(threeGeometry);
}

function toggleWireframe(checked) {
	showWireframe = checked;
	if (showWireframe) threeMesh.add(wireframe);
	else threeMesh.remove(wireframe);
}