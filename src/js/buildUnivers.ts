import { Mesh, MeshBuilder, TransformNode, Vector3 } from 'babylonjs';
import {scene, engine, canvas} from './init';

// Global Odyssey Counter for naming.
let odysseyCounter : number = 0;

export const BuildTheUniverse = () => {

    BuildAccountLayer();
    BuildRingsLayer();

}




const BuildRing = (_amount : number, _ringRadius : number, _ringNumber : number, _baseOdyssey : Mesh) =>
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

           const _newOdyssey = _baseOdyssey.createInstance("Odyssey" + odysseyCounter);
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
    let numberOfAccounts : number = 1000;
    let spaceBetweenAccounts : number = 10

    // Creation of a base sphere for the instanced meshes.
    const baseSphere = MeshBuilder.CreateSphere('Odyssey', {diameter: 1}, scene);
    baseSphere.isVisible = false; // Made the original sphere invisible.
    
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
    accountLayer.position.y = -100;
    accountLayer.position.z = 200;
}

const BuildRingsLayer= () => {

    // Base variables.
    let AllOdysseyRings = new Array<TransformNode>; 
    let totalAmountOfOdysseys : number = 2000;
    let halfAmountOfOdysseys : number = totalAmountOfOdysseys / 2;

    const baseOdyssey = MeshBuilder.CreateSphere('Odyssey', {diameter: 1}, scene);
    baseOdyssey.isVisible = false; // Made the original sphere invisible.

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
        const newRing : TransformNode = BuildRing( odysseysInThisRing, ringRadius, AllOdysseyRings.length, baseOdyssey);

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
        updateable: false,
    }

    const path = MeshBuilder.CreateLines('Path', pathOptions, scene);

}