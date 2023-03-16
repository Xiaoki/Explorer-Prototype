import { Engine, UniversalCamera, Scene, Vector3, Mesh, MeshBuilder, PBRMaterial, Texture, Color3, StandardMaterial, KeyboardEventTypes, PointerEventTypes, KeyboardInfo, DeviceSourceManager, DeviceType, Quaternion } from "babylonjs";
import glassTexture from '../assets/wispReflection.jpg';
import { objectsWithUpdate } from "./init";


export class PlayerController {
    
    scene : Scene;
    canvas : HTMLCanvasElement;
    camera : UniversalCamera;
    engine : Engine;
    playerMesh : Mesh;
    baseMovementSpeed : number = .5;
    fastMovementSpeed: number = 5;
    wispAnimationHeight : number = .25;
    wispAnimationSpeedY: number = 0.001;
    wispAnimationSpeedX: number = 0.002;
    wispMaterial : PBRMaterial;
    wispReflectionTexture : Texture;



    constructor ( scene : Scene, canvas : HTMLCanvasElement, engine : Engine) {
        
        // Assign core variables.
        this.scene = scene;
        this.canvas = canvas;
        this.engine = engine;
        

        // Setup first person camera for the whisp.
        this.camera = new UniversalCamera('PlayerCamera', new Vector3(0, 10, -20));
        this.setupPlayerCamera();

        // Create player wisp material and mesh.
        this.playerMesh = MeshBuilder.CreateSphere('wisp', { segments: 32, diameter: 1}, scene);
        this.wispReflectionTexture = new Texture(glassTexture, scene)
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
                 
                    if(inputInfo.event.code == "ShiftLeft" && this.camera.speed != this.fastMovementSpeed)
                    {
                        // Shift is down. Go faster
                        this.camera.speed = this.fastMovementSpeed;
                        
                    }
                

                    break;

                case KeyboardEventTypes.KEYUP:
                    
                    if(inputInfo.event.code == "ShiftLeft")
                    {
                        // Shift key is up. Change speed to normal
                        this.camera.speed = this.baseMovementSpeed;
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
        this.playerMesh.setParent(this.camera);
        this.playerMesh.position = new Vector3(0,-2.5,10);

        // Setup glass material
        this.wispMaterial.reflectivityTexture= this.wispReflectionTexture;
        this.wispMaterial.reflectionTexture = this.wispReflectionTexture;
        this.wispMaterial.indexOfRefraction = 0.52;
        this.wispMaterial.alpha = 0.5;
        this.wispMaterial.directIntensity = 0.0;
        this.wispMaterial.environmentIntensity = 0.7;
        this.wispMaterial.cameraExposure = 0.66;
        this.wispMaterial.cameraContrast = 1.66;
        this.wispMaterial.microSurface = 1;
        this.wispMaterial.reflectivityColor = new Color3(0.2, 0.2, 0.2);
        this.wispMaterial.albedoColor = new Color3(0.95, 0.95, 0.95);

        const testMaterial : StandardMaterial = new StandardMaterial('testMaterial', this.scene);
        testMaterial.diffuseColor = new Color3(0.4,0.5,0.7);
        testMaterial.diffuseTexture = this.wispReflectionTexture;

        // Assign the glass material to the wisp model.
        this.playerMesh.material = testMaterial;


    }

    lockTheMouseinput = (state: boolean) => 
    {
        this.engine.isPointerLock = state;
    }

    setupPlayerCamera = () => {

        
        // Set camera base speed.
        this.camera.attachControl(this.canvas, true)  
        this.camera.speed = this.baseMovementSpeed;
        
        // Add WASD movement to the camera.
            this.camera.keysUpward.push(69);
            this.camera.keysDownward.push(81);
            this.camera.keysUp.push(87);
            this.camera.keysDown.push(83);
            this.camera.keysLeft.push(65);
            this.camera.keysRight.push(68);
    }

    animateWispMovement = () => {

        // Animate the wisp.
        this.playerMesh.position.y = -2.5 - (this.wispAnimationHeight * Math.sin(performance.now() * this.wispAnimationSpeedY));
        this.playerMesh.position.x = this.wispAnimationHeight * Math.sin(performance.now() * this.wispAnimationSpeedX);
        this.playerMesh.rotation.z += this.wispAnimationSpeedX;
        
    }


    RotateCameraTowardsTarget = (camera : UniversalCamera, target : Vector3 ) => {

        // Get direction towards the target/
        const direction = target.subtract(camera.globalPosition);

        console.log(direction);
;
    }

    // Called Everyframe from the index.ts
    Update = () => {
        
        this.animateWispMovement()  

    }




    

};