/**
 * Based on https://github.com/mrdoob/three.js/blob/a72347515fa34e892f7a9bfa66a34fdc0df55954/examples/js/exporters/STLExporter.js
 * Tested on r68 and r70
 * @author kjlubick / https://github.com/kjlubick
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 */
THREE.STLExporterGeometry = function () {};

THREE.STLExporterGeometry.prototype = {

	constructor: THREE.STLExporterGeometry,

	parse: ( function () {

		var vector = new THREE.Vector3();
		var normalMatrixWorld = new THREE.Matrix3();
		var indexVertex = 0;
			var indexVertexUvs = 0;
			var indexNormals = 0;
			
			var vertex = new THREE.Vector3();
			var normal = new THREE.Vector3();
			var uv = new THREE.Vector2();
			
			var i, j, l, m, face = [];
			
		return function ( scene ) {

			var output = '';
			
			output += 'solid exported\n';
			
			scene.traverse( function ( object ) {

				if ( object instanceof THREE.Mesh ) {

					var geometry = object.geometry;
					var matrixWorld = object.matrixWorld;
					var mesh = object;

					if ( geometry instanceof THREE.BufferGeometry ) {
					
						var vertices = geometry.getAttribute( 'position' );
						var faces = geometry.getIndex();
						var uvs = geometry.getAttribute( 'uv' );
						var normals = geometry.getAttribute( 'normal' );
						
						if( normals !== undefined ) {
						
							normalMatrixWorld.getNormalMatrix( matrixWorld );
							
							for ( i = 0, l = normals.count; i < l; i ++ ) {
								
								normal.x = normals.getX( i );
								normal.y = normals.getY( i );
								normal.z = normals.getZ( i );
								
								// transfrom the normal to world space
								normal.applyMatrix3( normalMatrixWorld );
								
								// transform the normal to export format
								output += '\tfacet normal ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';
								
							//}
						//}
								output += '\t\touter loop\n';
								if( vertices !== undefined ) {
									
									//for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {
									
										vertex.x = vertices.getX( 9 * i + 0 );
										vertex.y = vertices.getY( 9 * i + 1 );
										vertex.z = vertices.getZ( 9 * i + 2 );
										
										// transfrom the vertex to world space
										vertex.applyMatrix4( mesh.matrixWorld );
										
										// transform the vertex to export format
										output += '\t\t\tvertex ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';
										
										
										vertex.x = vertices.getX( 9 * i + 3 );
										vertex.y = vertices.getY( 9 * i + 4 );
										vertex.z = vertices.getZ( 9 * i + 5 );
										
										// transfrom the vertex to world space
										vertex.applyMatrix4( mesh.matrixWorld );
										
										// transform the vertex to export format
										output += '\t\t\tvertex ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';
										
										
										vertex.x = vertices.getX( 9 * i + 6 );
										vertex.y = vertices.getY( 9 * i + 7 );
										vertex.z = vertices.getZ( 9 * i + 8 );
										
										// transfrom the vertex to world space
										vertex.applyMatrix4( mesh.matrixWorld );
										
										// transform the vertex to export format
										output += '\t\t\tvertex ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';
									//}
								}
								output += '\t\tendloop\n';
								output += '\tendfacet\n';
							}
						}
					}
				}

			} );

			output += 'endsolid exported\n';

			return output;
		};
	}() )
};

// Use FileSaver.js 'saveAs' function to save the string
function saveSTL2( scene, name ){ 
  var exporter = new THREE.STLExporterGeometry();
  var stlString = exporter.parse( scene );

  var blob = new Blob([stlString], {type: 'text/plain'});
  saveAs(blob, name + '.stl');
}