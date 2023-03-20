import gsap from 'gsap';
import {  DualSenseInput, Quaternion, UniversalCamera, Vector3 } from 'babylonjs';


// Using Gsap animate a Camera towards a new location.
export const FlyToPosition = (object : UniversalCamera, location : Vector3 ) => {
    
    // How long does the animation last.
    const duration : number = 2;
    

    gsap.to(object.position, {
        x: location.x,
        y: location.y,
        z: location.z,
        duration: duration,

        onStart: () => {

        },

        onUpdate: () => {
            
            // No actions yet.
        },

        onComplete: () => {
            // No actions yet.
        },


    })
}