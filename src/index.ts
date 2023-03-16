import './style.css';
import { scene, engine, SetupEnvironment, LoadModels, player, objectsWithUpdate, UIReference, DisplayFPS} from './js/init';

SetupEnvironment();
LoadModels();
const fpsCounterReference : HTMLDivElement = DisplayFPS();


// Called every frame.
engine.runRenderLoop( () => {
    
    scene.render(); 
    player.Update();

    // Trigger the Update function on all objects in this array.
    if (objectsWithUpdate) {
        objectsWithUpdate.forEach( (object) => {
            if(object.Update()){
                object.Update();
            }
        })
    }

    if(fpsCounterReference){
        fpsCounterReference.innerHTML = engine.getFps().toFixed() + " fps";
    }
});

// Listen for resize event of the browser.
window.addEventListener("resize", () => {
    engine.resize();
    UIReference.ResetUIElements();

})


