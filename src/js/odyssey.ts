import { scene } from "./init";
import { Scene, Mesh, MeshBuilder, InstancedMesh, PBRMaterial, HDRCubeTexture, TransformNode } from "babylonjs";
import { hdrImageTexture } from '../assets/test.hdr';

export const setupBaseMeshes = () => {

}



export class Odyssey extends TransformNode {

    type : string = 'odyssey';
    orb : InstancedMesh;
    avatar : InstancedMesh;

    constructor (name : string, scene : Scene, baseOrb : Mesh, avatarCircle : Mesh) {
        
        super(name, scene);

        this.orb = baseOrb.createInstance('outerOrb');
        this.avatar = avatarCircle.createInstance('avatarCircle'); 

        this.orb.parent = this;
        this.avatar.parent = this;
        this.metadata = { type: "Odyssey" }

        

    }

}