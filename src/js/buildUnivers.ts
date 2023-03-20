import { AbstractMesh, Color3, HDRCubeTexture, Mesh, MeshBuilder, PBRMaterial, StandardMaterial, TransformNode, Vector3 } from 'babylonjs';
import {scene, engine, canvas} from './init';
import hdrImageTexture from '../assets/test.hdr';
import { Odyssey } from './odyssey';

// Global Odyssey Counter for naming.
let odysseyCounter : number = 0;

export const BuildTheUniverse = () => {

    BuildAccountLayer();
    BuildRingsLayer();

}


const BuildRing = (_amount : number, _ringRadius : number, _ringNumber : number, _baseOdyssey : Mesh, _avatarCircle : Mesh) =>
   {
       const ring = new TransformNode('Ring' + _ringNumber, scene);
       const spaceBetweenOddyseys = 360 / _amount;
       let _Offset = 0;

       // Create instance and location for every Odyssey. Based on amount given.
       for (let i = 0; i < _amount; i++) {//

           // Increase OdysseyCounter for naming purposes.
           odysseyCounter++;//

           // Calculate radian for circle placement.
           const radian = _Offset * (Math.PI / 180) // Define how many radian per 1 degree. multiply by current offset (xdegrees)//

           // const _newOdyssey = _baseOdyssey.createInstance("Odyssey" + odysseyCounter);
           const _newOdyssey = new Odyssey("Odyssey" + odysseyCounter, scene, _baseOdyssey, _avatarCircle);
           _newOdyssey.metadata = { type: 'odyssey'}
           _newOdyssey.position.x = Math.cos(radian) * (Math.random() * _ringRadius);
           _newOdyssey.position.y = Math.sin(radian) * _ringRadius;
           _newOdyssey.position.z = (Math.random() * 2 ) * _ringNumber;
           _Offset = _Offset + spaceBetweenOddyseys;

           _newOdyssey.parent = ring;
       }

       return ring;
   }


const BuildAccountLayer = () =>
{
    // Transform node for grouping all account objects.
    const accountLayer : TransformNode = new TransformNode('AccountLayer', scene);

    // Number variables for building the field.
    let counter : number = 0;
    let row : number = 0;
    let accountsPerRow : number = 20;
    let numberOfAccounts : number = 500;
    let spaceBetweenAccounts : number = 10

    // Creation of a base sphere for the instanced meshes.
    const baseSphere = MeshBuilder.CreateSphere('Odyssey', {diameter: 1}, scene);
    baseSphere.isVisible = false; // Made the original sphere invisible.

    const hdrTextureAccounts = new HDRCubeTexture(hdrImageTexture, scene, 512, false, true, false, true);
    const glassMaterial = new PBRMaterial("glass", scene);
    glassMaterial.reflectionTexture = hdrTextureAccounts;    
    glassMaterial.indexOfRefraction = 0.52;
    glassMaterial.alpha = 0.5;
    glassMaterial.directIntensity = 0.0;
    glassMaterial.environmentIntensity = 0.7;
    glassMaterial.cameraExposure = 0.66;
    glassMaterial.cameraContrast = 1.66;
    glassMaterial.microSurface = 1;
    glassMaterial.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    glassMaterial.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);
    baseSphere.material = glassMaterial;
    
    // Create the instanced meshes and add them to the transform layer ( group )
    for (let index = 0; index < numberOfAccounts; index++) 
    {
        // Declare new instance.
        const newInstance = baseSphere.createInstance("sphere" + index);
        newInstance.metadata = { type: "account"}

        // Adapt numbers based on current instance.
        if (counter >= accountsPerRow){
            row++
            counter = 0;
        }

        // Set the position of the current instance.
        newInstance.position.z = row * spaceBetweenAccounts;
        newInstance.position.x = counter * spaceBetweenAccounts;
        counter++;

        

        // Set the parent of the current instance to the transform node. ( account layer)
        newInstance.parent = accountLayer;
    }

    // Center the accounterLayer in the Universe.
    const offset = (accountsPerRow * spaceBetweenAccounts) / 2; // Calculate total width. Divide by 2 for mid point.
    accountLayer.position.x = accountLayer.position.x - offset; // Apply the offset to the container.
    accountLayer.position.y = -50;
    accountLayer.position.z = 200;
}

const BuildRingsLayer= () => {

    // Base variables.
    let AllOdysseyRings = new Array<TransformNode>; 
    let totalAmountOfOdysseys : number = 1000;
    let halfAmountOfOdysseys : number = totalAmountOfOdysseys / 2;


    // Create base meshes for the Odyssey.
    const baseOrb = MeshBuilder.CreateSphere('Odyssey', {diameter: 1}, scene);
    const avatarCircle = MeshBuilder.CreateDisc('avatarDisc', { radius: 0.3 }, scene)

    // Setup glass material for orb
    const hdrTexture = new HDRCubeTexture(hdrImageTexture, scene, 512, false, true, false, true);
    const orbMaterial = new PBRMaterial('orbGlass', scene);

    orbMaterial.reflectionTexture = hdrTexture;    
    orbMaterial.indexOfRefraction = 0.52;
    orbMaterial.alpha = 0.5;
    orbMaterial.directIntensity = 0.0;
    orbMaterial.environmentIntensity = 0.7;
    orbMaterial.cameraExposure = 0.66;
    orbMaterial.cameraContrast = 1.66;
    orbMaterial.microSurface = 1;
    orbMaterial.reflectivityColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    orbMaterial.albedoColor = new BABYLON.Color3(0.95, 0.95, 0.95);

    // Asign materials
    baseOrb.material = orbMaterial;
    //avatarCircle.material = orbMaterial;


    // Calculate amount of Odyssey is next ring.
    let odysseysInThisRing = 12;
    let ringRadius = 25;
    let zValueRing = 10;
    let halfWayZValue;

    // Start building rings.
    while (totalAmountOfOdysseys >= 1) {


        if(odysseysInThisRing <= 0){
            return
        }
        totalAmountOfOdysseys = totalAmountOfOdysseys - odysseysInThisRing;
        
        // Build the ring.
        const newRing : TransformNode = BuildRing( odysseysInThisRing, ringRadius, AllOdysseyRings.length, baseOrb, avatarCircle);

        // Set newRing depth
        newRing.position.z = zValueRing;
        AllOdysseyRings.push(newRing);

        zValueRing = zValueRing * 1.2;
        
        
        if(totalAmountOfOdysseys >= halfAmountOfOdysseys){
            
            // prepare amount for the next ring.
            odysseysInThisRing = Math.floor( odysseysInThisRing * 1.2);

            // Preparing ring radius
            ringRadius = ringRadius * 1.1;
        } else {

            //odysseysInThisRing = Math.floor( odysseysInThisRing * 0.8);

            ringRadius =  ringRadius * 0.9;  
             
        }

        if(totalAmountOfOdysseys <= 0 ) {
            totalAmountOfOdysseys = 0;
        }

        if (odysseysInThisRing > totalAmountOfOdysseys) {
            odysseysInThisRing = totalAmountOfOdysseys;
        }

    }

    // Create one transform for all Rings.
    const allRingsTransformNode = new TransformNode('GlobalUniverseTransform', scene);
    AllOdysseyRings.forEach( ring => ring.parent = allRingsTransformNode); 
    allRingsTransformNode.position.z = 200;
    allRingsTransformNode.position.y = 50;

    BuildPath(BuildPointsArray(AllOdysseyRings));

}

const BuildPointsArray = (allRings : Array<TransformNode>) => {
    
    let newVector3Array = new Array<Vector3>;

    for(let i = 0; i < allRings.length; i++)
    {
        const ringChildren = allRings[i].getChildMeshes();
        const randomNumber = Math.floor(Math.random() * ringChildren.length);
        newVector3Array.push(ringChildren[randomNumber].getAbsolutePosition());
        
    }

    return newVector3Array;
}

const BuildPath = ( vectorArray : Array<Vector3> ) => {

    const pathOptions = {
        points : vectorArray,
        updateable: true,
    }

    const path = MeshBuilder.CreateLines('Example Path', pathOptions, scene);   
    path.alpha = 0.5;

}