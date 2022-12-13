import "./styles.css"; // keep this here!

// naimportujte vše co je potřeba z BabylonJS
import {
  Engine,
  Scene,
  UniversalCamera,
  MeshBuilder,
  Path3D,
  StandardMaterial,
  DirectionalLight,
  Vector3,
  Axis,
  Space,
  Color3,
  SceneLoader,
  DeviceOrientationCamera,
  Mesh,
  Animation,
  SixDofDragBehavior
} from "@babylonjs/core";
import "@babylonjs/inspector";

//canvas je grafické okno, to rozáhneme přes obrazovku
const canvas = document.getElementById("renderCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const engine = new Engine(canvas, true);

//scéna neměnit
var scene = new Scene(engine);
// Default Environment

//vytoření kamery v pozici -5 (dozadu)
const camera = new DeviceOrientationCamera(
  "kamera",
  new Vector3(-150, 50, 17),
  scene
);

//zaměřit kameru do středu
camera.setTarget(new Vector3(0, 1, 0));

//spojení kamery a grafikcého okna
camera.attachControl(canvas, true);

//zde přídáme cyklus for

//světlo
const light1 = new DirectionalLight(
  "DirectionalLight",
  new Vector3(-1, -1, -1),
  scene
);

//vytvoření cesty
var points = [];
var n = 450; //počet bodů
var r = 50; //radius křivky
for (var i = 0; i < n + 1; i++) {
  points.push(
    new Vector3(
      (r + (r / 5) * Math.sin((15 * i * Math.PI) / n)) *
        Math.sin((2 * i * Math.PI) / n),
      0,
      (r + (r / 10) * Math.sin((6 * i * Math.PI) / n)) *
        Math.cos((2 * i * Math.PI) / n)
    )
  );
}
//vykreslení křivky
var track = MeshBuilder.CreateLines("track", { points });
var octanus = MeshBuilder.CreateCylinder("octanus", { diameter: 0.00001 });

var path3D = new Path3D(points);
var normals = path3D.getNormals();
SceneLoader.ImportMesh("", "public/", "Octanus.glb", scene, function (
  noveModely
) {
  octanus = noveModely[0];
  octanus.scaling = new Vector3(0.1, 0.1, 0.1);
  octanus.rotation = new Vector3(-1.8, 0, 0);
});
SceneLoader.ImportMesh("", "public/", "Flag.glb", scene, function (newMeshes) {
  // get the first mesh from the imported model
  const flag = newMeshes[0];
  flag.position = new Vector3(0, 0, 0); // set position to the center of the scene
  flag.scaling = new Vector3(0.1, 0.1, 0.1);
  flag.rotation = new Vector3(-1.6, 1, 0);
});
//úhly a rotace

//animace
var i = 0;
scene.registerAfterRender(function () {
  octanus.position.x = points[i].x;
  octanus.position.z = points[i].z;

  var theta = Math.acos(Vector3.Dot(normals[i], normals[i + 1]));
  var sklopeni = Vector3.Cross(normals[i], normals[i + 1]).y;
  sklopeni = sklopeni / Math.abs(sklopeni);
  octanus.rotate(Axis.Y, sklopeni * theta, Space.WORLD);
  i = (i + 1) % (n - 1);
});

//fyzika

// povinné vykreslování
engine.runRenderLoop(function () {
  scene.render();
});
const environment1 = scene.createDefaultEnvironment({
  enableGroundShadow: true
});
// zde uděláme VR prostředí

const xrHelper = scene.createDefaultXRExperienceAsync({
  // define floor meshes
  floorMeshes: [environment1.ground]
});
//environment1.setMainColor(new Color3.FromHexString("#74b9ff"));
environment1.ground.parent.position.y = 0;
environment1.ground.position.y = 0;
scene.debugLayer.show();
