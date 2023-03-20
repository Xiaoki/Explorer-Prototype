import { HDRCubeTexture, Engine, UniversalCamera, Scene, Vector3, Mesh, MeshBuilder, PBRMaterial, Texture, Color3, StandardMaterial, KeyboardEventTypes, PointerEventTypes, KeyboardInfo, DeviceSourceManager, DeviceType, Quaternion, AbstractMesh, TransformNode } from "babylonjs";
import hdrImageTexture from '../assets/test.hdr';
import { objectsWithUpdate } from "./init";


export class PlayerController {
    
    scene : Scene;
    canvas : HTMLCanvasElement;
    static camera : UniversalCamera;
    engine : Engine;
    playerMesh : Mesh;
    baseMovementSpeed : number = .5;
    fastMovementSpeed: number = 5;
    wispAnimationHeight : number = .25;
    wispAnimationSpeedY: number = 0.001;
    wispAnimationSpeedX: number = 0.002;
    wispMaterial : PBRMaterial;
    wispReflectionTexture : HDRCubeTexture;



    constructor ( scene : Scene, canvas : HTMLCanvasElement, engine : Engine) {
        
        // Assign core variables.
        this.scene = scene;
        this.canvas = canvas;
        this.engine = engine;
        

        // Setup first person camera for the whisp.
        PlayerController.camera = new UniversalCamera('PlayerCamera', new Vector3(0, 10, -20));
        this.setupPlayerCamera();

        // Create player wisp material and mesh.
        this.playerMesh = MeshBuilder.CreateSphere('wisp', { segments: 32, diameter: 1}, scene);
        this.wispReflectionTexture = new HDRCubeTexture(hdrImageTexture, this.scene, 512, false, true, false, true);
        this.wispMaterial = new PBRMaterial("glassMaterial", scene);
        this.setupPlayerWisp();

        // Create input listener.
        this.createKeyInputListener();

    }

    // Handle button input that is not WASD related. 
    createKeyInputListener = () => 
    {
        this.scene.onKeyboardObservable.add( ( inputInfo ) => 
        { 
        
            switch (inputInfo.type) 
            {   
            
                case KeyboardEventTypes.KEYDOWN:
                 
                    if(inputInfo.event.code == "ShiftLeft" && PlayerController.camera.speed != this.fastMovementSpeed)
                    {
                        // Shift is down. Go faster
                        PlayerController.camera.speed = this.fastMovementSpeed;
                        
                    }
                

                    break;

                case KeyboardEventTypes.KEYUP:
                    
                    if(inputInfo.event.code == "ShiftLeft")
                    {
                        // Shift key is up. Change speed to normal
                        PlayerController.camera.speed = this.baseMovementSpeed;
                    }
                    
                    break;

            }

            
        });


        this.scene.onPointerObservable.add( (pointerInfo) => 
        {
            switch (pointerInfo.type)    
            {
                case PointerEventTypes.POINTERDOWN:
                        
                    // hide the mouse pointer when the mouse button is pressed.
                    document.body.style.cursor = "none";
                    this.engine.isPointerLock = true;
                    
                    break;

                case PointerEventTypes.POINTERUP:
                    
                    // show the mouse button again on mouseup.
                    document.body.style.cursor = "auto";
                    this.engine.isPointerLock = false;
                    break;
            }
        });
    }

    setupPlayerWisp = () => {

        // Attach player wisp to camera.
        this.playerMesh.setParent(PlayerController.camera);
        this.playerMesh.position = new Vector3(0,-2.5,10);
        
        
        this.wispMaterial.reflectionTexture = this.wispReflectionTexture;    
        this.wispMaterial.indexOfRefraction = 0.52;
        this.wispMaterial.alpha = 0.5;
        this.wispMaterial.directIntensity = 0.0;
        this.wispMaterial.environmentIntensity = 0.7;
        this.wispMaterial.cameraExposure = 0.66;
        this.wispMaterial.cameraContrast = 1.66;
        this.wispMaterial.microSurface = 1;
        this.wispMaterial.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
        this.wispMaterial.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
        this.playerMesh.material = this.wispMaterial;


    }

    lockTheMouseinput = (state: boolean) => 
    {
        this.engine.isPointerLock = state;
    }

    setupPlayerCamera = () => {

        
        // Set camera base speed.
        PlayerController.camera.attachControl(this.canvas, true)  
        PlayerController.camera.speed = this.baseMovementSpeed;
        
        // Add WASD movement to the camera.
            PlayerController.camera.keysUpward.push(69);
            PlayerController.camera.keysDownward.push(81);
            PlayerController.camera.keysUp.push(87);
            PlayerController.camera.keysDown.push(83);
            PlayerController.camera.keysLeft.push(65);
            PlayerController.camera.keysRight.push(68);
    }

    animateWispMovement = () => {

        // Animate the wisp.
        this.playerMesh.position.y = -2.5 - (this.wispAnimationHeight * Math.sin(performance.now() * this.wispAnimationSpeedY));
        this.playerMesh.position.x = this.wispAnimationHeight * Math.sin(performance.now() * this.wispAnimationSpeedX);
        this.playerMesh.rotation.z += this.wispAnimationSpeedX;
        
    }


    RotateCameraTowardsTarget = (target : TransformNode) => {

        // Get direction towards the target/
        //const direction : Vector3 = target.subtract(PlayerController.camera.globalPosition).normalize();

        //this.scene.registerBeforeRender(() => {
        //    PlayerController.camera.target = Vector3.Lerp(PlayerController.camera.target, target,0.05);
//
        //    if (PlayerController.camera.target === target ){
        //        
        //    }
        //});

        //PlayerController.camera.target = target;

        //const matrix = target.getWorldMatrix();
        //const globalPosition = Vector3.TransformCoordinates
        PlayerController.camera.setTarget(target.absolutePosition)
        //PlayerController.camera.target = (target.absolutePosition);

    }







    // Called Everyframe from the index.ts
    Update = () => {
        
        this.animateWispMovement()  
        

    }




    




    

};