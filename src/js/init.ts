import sign from '../assets/sign.glb';
import background from '../assets/ai.png';
import 'babylonjs-loaders';
import { PlayerController } from './PlayerController';
import { BuildTheUniverse } from './buildUnivers';

import {
    Engine, 
    Scene, 
    ArcRotateCamera,
    MeshBuilder,
    Vector3,
    HemisphericLight,
    SceneLoader,
    UniversalCamera,
    StandardMaterial,
    Texture,
    Color3,
    Plane,
    Tools,
    Mesh,
    CubeTexture,
    DerivativeBlock,
    Quaternion,
} from 'babylonjs';

// Import Skybox images
import _px from '../assets/skybox/px.png';
import _py from '../assets/skybox/py.png';
import _pz from '../assets/skybox/pz.png';
import _nx from '../assets/skybox/nx.png';
import _ny from '../assets/skybox/ny.png';
import _nz from '../assets/skybox/nz.png';

import { UIController } from './UIController';

export let engine : Engine ;
export let canvas : HTMLCanvasElement ;
export let scene : Scene ;
export let camera : UniversalCamera;
export let player : PlayerController;
export let objectsWithUpdate = new Array<any>; // These objects require a Update() method and is called every frame.
export let UIReference : UIController;

// export let wispMesh : object;

export const SetupEnvironment = () => {
 
    // Setup the canvas and append to the webpage.
    canvas = document.createElement("canvas")
    canvas.classList.add('webgl');
    document.body.appendChild(canvas);

    // Setup the engine
    engine = new Engine(canvas, true);
    scene = new Scene(engine);

    // Create a new player with a firstperson camera.
    player = new PlayerController(scene, canvas, engine);
    camera = player.camera;

    // Add light to the scene.
    const light = new HemisphericLight('light1', new Vector3(3, 3, 0), scene);

    // Create UI controller
    UIReference = new UIController();

    // Build the Universe
    BuildTheUniverse();

    // show debug inspector.  
    /*  
    scene.debugLayer.show({
        embedMode: true,
    });
    */
    
  
};


export const LoadModels = () => {

    //Setup Universe Plane image.
    const universePlaneMaterial : StandardMaterial = new StandardMaterial('UniverseImage', scene);
    universePlaneMaterial.diffuseTexture = new Texture(background, scene);
    universePlaneMaterial.specularColor = new Color3(0,0,0);
    universePlaneMaterial.backFaceCulling = false;


    //load skybox
    const skybox = MeshBuilder.CreateBox('Skybox', {size: 8000 }, scene);
    const skyboxMaterial = new StandardMaterial('skyboxMaterial', scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new CubeTexture(' ', scene, [_px, _py, _pz, _nx, _ny, _nz])
    skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new Color3(0,0,0);
    skyboxMaterial.specularColor = new Color3(0,0,0);
    skybox.material = skyboxMaterial;

    // Load custom model.
    /*
    SceneLoader.ImportMeshAsync("", "", sign, scene ).then( (result) => {
        // Use the result variable to do something.
    });

    */

}

export const DisplayFPS = () =>
{
    const fpsCounter = document.createElement('div');
    fpsCounter.classList.add('fpscounter');
    document.body.appendChild(fpsCounter);

    return fpsCounter;
}



const getCurrentTime = () => {
    let date = new Date();
    return date.getMilliseconds();
}

// Find a random odyssey in the scene and return it.
export const getRandomOdyssey = () => {
    
    let randomMesh

    // Only return if an odyssey was selected.
    do {
        const random = Math.floor(Math.random() * scene.meshes.length);
        randomMesh = scene.meshes[random];
    } while (randomMesh.metadata.type != 'odyssey')

    return randomMesh;

}

export const GetTargetPosition = (_object : Vector3, _target : Vector3 ) => {

    // direction = Destination - source (normalized)
    const direction : Vector3 = _target.subtract(_object).normalize();

    // distance between destination and source.
    const distance : number = Vector3.Distance(_object, _target);

    // distance minus camera offset so we do not arrive inside the odyssey.
    const newLength : number = distance - 5;

    // Destination is: move newLength along the direction.
    const destination : Vector3 = _object.add(direction.scale(newLength));

    return destination
    
}

export const GetLookAtDirection= (_object : Vector3, _target : Vector3 ) => {

    const direction : Vector3 = _target.subtract(_object).normalize();
    //const quanternion : Quaternion=  direction.toQuaternion().normalize();

    return direction;


}

