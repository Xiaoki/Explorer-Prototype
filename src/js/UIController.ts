import { 
    AdvancedDynamicTexture, 
    Button, 
    Rectangle, 
    Control, 
    TextBlock, 
    InputText, 
    Image,
    StackPanel,
} from 'babylonjs-gui';
import { AbstractMesh, TransformNode, Vector3 } from 'babylonjs';
import {canvas, scene, engine, player, getRandomOdyssey, GetTargetPosition, camera, GetLookAtDirection } from './init';
import { FlyToPosition } from './animations';

// Load Images.
import fullscreenImage from '../assets/fullscreen.png';
import homebtn from '../assets/homebtn.png';
import highlightOdysseyImage from '../assets/chat_profile.png';
import smallprofile from '../assets/small_profile.png';
import profileImageLink from '../assets/profileimage.png'
import { random } from 'gsap';
import { getQuaternion } from 'babylonjs-loaders/glTF/2.0/glTFLoaderAnimation';
import { PlayerController } from './PlayerController';
import { Odyssey } from './odyssey';

export class UIController 
{

    advancedTexture : AdvancedDynamicTexture;
    fullScreenButton : Button;
    container : Rectangle;
    mainNav : Rectangle;
    profileNav : Rectangle;

    constructor() {

        // Create Dynamic Texture for overlay of UI.
        this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');
        this.fullScreenButton = Button.CreateImageOnlyButton('fullscreenbtn', fullscreenImage);
        this.container = new Rectangle();
        this.mainNav = new Rectangle();
        this.profileNav = new Rectangle();

        this._SetFullScreenButton();
        this._CreateMainNavigator();
        
    }

    _SetFullScreenButton = () => {

        this.fullScreenButton.width = "50px";
        this.fullScreenButton.height = "50px";
        this.fullScreenButton.thickness = 0;
        this.fullScreenButton.top = ( canvas.height /2 ) - 70;
        this.fullScreenButton.left = ( canvas. width /2 ) - 100;

        this.fullScreenButton.onPointerUpObservable.add(function() {
            engine.enterFullscreen(false);
        });

        this.advancedTexture.addControl(this.fullScreenButton);

    }

    ResetUIElements = () => {
        
        this.fullScreenButton.top = ( canvas.height /2 ) -70;
        this.fullScreenButton.left = ( canvas. width /2 ) - 100;
    }

    _CreateMainNavigator = () => {
        
        // Create container
        this.container.width = 0.5;
        this.container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.container.height = 1;
        this.container.paddingLeft = 25;
        this.container.paddingBottom = 25;
        this.container.paddingTop = 25;
        this.container.thickness = 0;
        this.advancedTexture.addControl(this.container);

        // Create mainMenu for inside container.
        this.mainNav.width = .5;
        this.mainNav.thickness = 1;
        this.mainNav.color = '#004373CC';
        this.mainNav.background = '#004373CC';
        this.mainNav.cornerRadius = 5;
        this.mainNav.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.mainNav.isVisible = false;
        

        this.container.addControl(this.mainNav);

        // Add home button on top left;
        const homeButton = Button.CreateImageOnlyButton('homeButton', homebtn )
        homeButton.thickness = 0;
        homeButton.height = '56px';
        homeButton.width = "46px";
        homeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        homeButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        homeButton.onPointerUpObservable.add( () => {
            if (this.mainNav.isVisible){
                this.mainNav.isVisible = false;
            } else { this.mainNav.isVisible = true}

        });
        this.container.addControl(homeButton);


        // Create title bar with exit btn.
        const titleContainer = new Rectangle('titlebar')
        titleContainer.width = 1;
        titleContainer.height = '40px';
        titleContainer.thickness = 0;
        titleContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.mainNav.addControl(titleContainer);
        

        const titleTextBlock = new TextBlock();
        titleTextBlock.text = 'Explore';
        titleTextBlock.color = '#F5f5f5';
        titleTextBlock.fontSize = '20px';
        titleContainer.addControl(titleTextBlock);

        const exitBtn = Button.CreateSimpleButton('Exit', 'X')
        exitBtn.thickness = 0;
        exitBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        exitBtn.width = '40px';
        exitBtn.color ='#f5f5f5';
        exitBtn.onPointerUpObservable.add( () => {
            if (this.mainNav.isVisible){
                this.mainNav.isVisible = false;
            };
            if( this.profileNav.isVisible){
                this.profileNav.isVisible = false;
            }
        })
        titleContainer.addControl(exitBtn);

        // Add search bar
        const searchContainer = new Rectangle('searchContainer');
        searchContainer.width = 1;
        
        searchContainer.height = '40px';
        searchContainer.paddingLeft = '8px';
        searchContainer.paddingTop = '10px';
        searchContainer.paddingRight = '8px';
        searchContainer.thickness = 1;
        searchContainer.color = '#9EEEFF99'
        searchContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        searchContainer.top = '50px';
        searchContainer.cornerRadius = 5;

        this.mainNav.addControl(searchContainer);

        // Add search input in the search bar.
        const searchInputField = new InputText();
        searchInputField.width = 0.8;
        searchInputField.height = 1;
        searchInputField.thickness = 0;
        searchInputField.color = '#9EEEFF99';
        searchInputField.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        searchInputField.background = '#004373CC';
        searchInputField.focusedBackground = '#004373CC';
        searchContainer.addControl(searchInputField);

        // Add Search go button
        const searchGoButton = Button.CreateSimpleButton('SearchBtn', 'Go')
        searchGoButton.width = 0.2;
        searchGoButton.thickness = 0;
        searchGoButton.color = '#9EEEFF99';
        searchGoButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        searchGoButton.height = 1;
        searchGoButton.onPointerUpObservable.add(() => {
            alert('Search Query: ' + searchInputField.text)
        });
        searchContainer.addControl(searchGoButton);

        // Button highlight Odyssey,.
        const highlightOdysseyButton = Button.CreateImageOnlyButton('Highlight', highlightOdysseyImage)
        highlightOdysseyButton.width = 1;
        highlightOdysseyButton.height = '150px';
        highlightOdysseyButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        highlightOdysseyButton.top = `120px`;
        highlightOdysseyButton.paddingLeft = `8px`;
        highlightOdysseyButton.paddingRight = `8px`;
        highlightOdysseyButton.cornerRadius = 5;
        highlightOdysseyButton.thickness = 0;
        highlightOdysseyButton.onPointerUpObservable.add( () => {
            if (!this.profileNav.isVisible){
                this.profileNav.isVisible = true;
                
            }
            // Fly to the odyssey that is randomly returned.
            const testtarget  : TransformNode= getRandomOdyssey();
            FlyToPosition(PlayerController.camera, GetTargetPosition(camera.globalPosition, testtarget.absolutePosition));
            player.RotateCameraTowardsTarget(testtarget);
            

        })
        this.mainNav.addControl(highlightOdysseyButton);

        

        // Create Highlight Reel with two oddysey highlight images.
        const highlightContainer1 = new Rectangle();
        highlightContainer1.width = 1;
        highlightContainer1.height = '200px';
        highlightContainer1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        highlightContainer1.thickness = 0;
        highlightContainer1.top = `300px`;
        this.mainNav.addControl(highlightContainer1);

        const highlightTextblock = new TextBlock();
        highlightTextblock.text = 'Last Updated'
        highlightTextblock.width = 1;
        highlightTextblock.height = `35px`;
        highlightTextblock.color = '#f5f5f5';
        highlightTextblock.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        highlightTextblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        highlightTextblock.paddingLeft = '15px';
        highlightTextblock.fontSize = '20px';

        highlightContainer1.addControl(highlightTextblock);
        
        // small highlight button 2x
        const smallHighlight1 = Button.CreateImageOnlyButton('Small Preview1', smallprofile);
        smallHighlight1.width = 0.5;
        smallHighlight1.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        smallHighlight1.height = '150px';
        smallHighlight1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        smallHighlight1.paddingLeft = '8px';
        smallHighlight1.paddingRight = '4px';
        smallHighlight1.top = `35px`
        smallHighlight1.cornerRadius = 5;
        smallHighlight1.thickness = 0;
        smallHighlight1.onPointerUpObservable.add( () => {
            if (!this.profileNav.isVisible){
                this.profileNav.isVisible = true;
                
            }
            // Fly to the odyssey that is randomly returned.
            const testtarget = getRandomOdyssey()
            FlyToPosition(PlayerController.camera, GetTargetPosition(camera.globalPosition, testtarget.absolutePosition));
            player.RotateCameraTowardsTarget(testtarget);
        })
                
        // small highlight button 2x
        const smallHighlight2 = Button.CreateImageOnlyButton('Small Preview1', smallprofile);
        smallHighlight2.width = 0.5;
        smallHighlight2.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        smallHighlight2.height = '150px';
        smallHighlight2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        smallHighlight2.paddingRight = '8px';
        smallHighlight1.paddingLeft = '4px';
        smallHighlight2.top = `35px`
        smallHighlight2.cornerRadius = 5;
        smallHighlight2.thickness = 0;
        smallHighlight2.onPointerUpObservable.add( () => {
            if (!this.profileNav.isVisible){
                this.profileNav.isVisible = true;
                
            }
            // Fly to the odyssey that is randomly returned.
            const testtarget = getRandomOdyssey()
            FlyToPosition(PlayerController.camera, GetTargetPosition(camera.globalPosition, testtarget.absolutePosition));
            player.RotateCameraTowardsTarget(testtarget);
        })

        highlightContainer1.addControl(smallHighlight1);
        highlightContainer1.addControl(smallHighlight2);



        // Create another Highlight Reel with two oddysey highlight images.
        const highlightContainer2 = new Rectangle();
        highlightContainer2.width = 1;
        highlightContainer2.height = '200px';
        highlightContainer2.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        highlightContainer2.thickness = 0;
        highlightContainer2.top = `500px`;
        this.mainNav.addControl(highlightContainer2);

        const highlightTextblock2 = new TextBlock();
        highlightTextblock2.text = 'Most staked in'
        highlightTextblock2.width = 1;
        highlightTextblock2.height = `35px`;
        highlightTextblock2.color = '#f5f5f5';
        highlightTextblock2.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        highlightTextblock2.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        highlightTextblock2.paddingLeft = '15px';
        highlightTextblock2.fontSize = '20px';

        highlightContainer2.addControl(highlightTextblock2);
        
        // small highlight button 2x
        const smallHighlight3 = Button.CreateImageOnlyButton('Small Preview1', smallprofile);
        smallHighlight3.width = 0.5;
        smallHighlight3.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        smallHighlight3.height = '150px';
        smallHighlight3.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        smallHighlight3.paddingLeft = '8px';
        smallHighlight3.paddingRight = '4px';
        smallHighlight3.top = `35px`
        smallHighlight3.cornerRadius = 5;
        smallHighlight3.thickness = 0;
        smallHighlight3.onPointerUpObservable.add( () => {
            if (!this.profileNav.isVisible){
                this.profileNav.isVisible = true;
                
            }
            // Fly to the odyssey that is randomly returned.
            FlyToPosition(PlayerController.camera, GetTargetPosition(camera.globalPosition, getRandomOdyssey().absolutePosition));
        })
                
        // small highlight button 2x
        const smallHighlight4 = Button.CreateImageOnlyButton('Small Preview1', smallprofile);
        smallHighlight4.width = 0.5;
        smallHighlight4.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        smallHighlight4.height = '150px';
        smallHighlight4.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        smallHighlight4.paddingRight = '8px';
        smallHighlight4.paddingLeft = '4px';
        smallHighlight4.top = `35px`
        smallHighlight4.cornerRadius = 5;
        smallHighlight4.thickness = 0;
        smallHighlight4.onPointerUpObservable.add( () => {
            if (!this.profileNav.isVisible){
                this.profileNav.isVisible = true;
                
                
            }
            // Fly to the odyssey that is randomly returned.
            const testtarget = getRandomOdyssey()
            FlyToPosition(PlayerController.camera, GetTargetPosition(camera.globalPosition, testtarget.absolutePosition));
            player.RotateCameraTowardsTarget(testtarget);
        })

        highlightContainer2.addControl(smallHighlight4);
        highlightContainer2.addControl(smallHighlight3);



        

        // Create menu for profile information.
        this.profileNav.width = 0.5;
        this.profileNav.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.profileNav.thickness = 1;
        this.profileNav.color = '#004373CC';
        this.profileNav.background = '#004373CC';
        this.profileNav.cornerRadius = 5;    
        this.profileNav.paddingLeft = 15;
        this.profileNav.isVisible = false;

        const profileStack = new StackPanel();
        profileStack.isVertical = true;
        profileStack.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        this.profileNav.addControl(profileStack);

        this.container.addControl(this.profileNav);

        // Create title and exit button for profile navigaiton./
        const profileTitleContainer = new Rectangle();
        profileTitleContainer.width = 1;
        profileTitleContainer.height = `35px`;
        profileTitleContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        profileTitleContainer.thickness = 0;
        profileStack.addControl(profileTitleContainer);

        const profileNameTextBlock = new TextBlock();
        profileNameTextBlock.text = "Odyssey Name";
        profileNameTextBlock.height = 1;
        profileNameTextBlock.width = 0.9;
        profileNameTextBlock.color = `#f5f5f5`
        profileNameTextBlock.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        profileNameTextBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        profileNameTextBlock.paddingLeft = 10;
        profileTitleContainer.addControl(profileNameTextBlock);

        const profileExitBtn = Button.CreateSimpleButton('Exit profile', 'X');
        profileExitBtn.width = 0.1;
        profileExitBtn.height = 1 ;
        profileExitBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        profileExitBtn.thickness = 0;
        profileExitBtn.color = `#f5f5f5`;
        profileExitBtn.onPointerUpObservable.add( () => {
            if (this.profileNav.isVisible){
                this.profileNav.isVisible = false;
            }
        })
        profileTitleContainer.addControl(profileExitBtn);

        // Add profile image to the profile popup.
        const profileImage = new Image('profileImage', profileImageLink);
        profileImage.height = "150px";
        profileImage.width = 1;
        profileImage.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        profileImage.paddingLeft = '8px';
        profileImage.paddingRight = '8px';
        profileImage.stretch = Image.STRETCH_FILL;

        profileStack.addControl(profileImage);

        const profileNameForDescription = new TextBlock();
        profileNameForDescription.text = 'SJORS HEAVEN';
        profileNameForDescription.height = '45px';
        profileNameForDescription.fontSize = '20px'
        profileNameForDescription.width = 1;
        profileNameForDescription.color = `#f5f5f5`
        profileNameForDescription.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP
        profileNameForDescription.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        profileNameForDescription.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        profileNameForDescription.paddingLeft = 10;
        profileNameForDescription.paddingTop = '8px'

        profileStack.addControl(profileNameForDescription);

        const profileDescriptionTextBlock = new TextBlock();
        profileDescriptionTextBlock.text = "This is my 'me' place. A place to relax and listen to records. All are welcome here."
        profileDescriptionTextBlock.width = 1;
        profileDescriptionTextBlock.color = '#f5f5f5'
        profileDescriptionTextBlock.height = '70px';
        profileDescriptionTextBlock.paddingLeft = '8px';
        profileDescriptionTextBlock.paddingRight = '8px';
        profileDescriptionTextBlock.paddingTop = '8px';
        profileDescriptionTextBlock.textWrapping = true;
        profileDescriptionTextBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        profileStack.addControl(profileDescriptionTextBlock);

        const stakeButton = Button.CreateSimpleButton('stake', "STAKE IN ODYSSEY");
        stakeButton.width = 1;
        const stakeBtnTextblock = stakeButton.textBlock;
        if (stakeBtnTextblock){
            stakeBtnTextblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            stakeBtnTextblock.paddingLeft = `8px`
        }
        stakeButton.height = `40px`
        stakeButton.color = '#f5f5f5'
        stakeButton.onPointerUpObservable.add( () => {
            alert('Where is my stake menu popup?')
        })
        stakeButton.paddingLeft = '8px';
        stakeButton.paddingRight = '8px';
        stakeButton.paddingTop = '8px';
        stakeButton.cornerRadius = 5;
        stakeButton.thickness = 0;
        stakeButton.fontSize = '12px'
        stakeButton.background = '#004373CC';
        profileStack.addControl(stakeButton);

        const enterButton = Button.CreateSimpleButton('stake', "VISIT ODYSSEY");
        enterButton.width = 1;
        const enterButtonBtnTextblock = enterButton.textBlock;
        if (enterButtonBtnTextblock){
            enterButtonBtnTextblock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            enterButtonBtnTextblock.paddingLeft = `8px`
        }
        enterButton.height = `40px`
        enterButton.color = '#f5f5f5'
        enterButton.onPointerUpObservable.add( () => {
            // Fly to the odyssey that is randomly returned.
            const testtarget = getRandomOdyssey()
            FlyToPosition(PlayerController.camera, GetTargetPosition(camera.globalPosition, testtarget.absolutePosition));
            player.RotateCameraTowardsTarget(testtarget);


        })
        enterButton.paddingLeft = '8px';
        enterButton.paddingRight = '8px';
        enterButton.paddingTop = '8px';
        enterButton.cornerRadius = 5;
        enterButton.thickness = 0;
        enterButton.fontSize = '12px'
        enterButton.background = '#004373CC';
        profileStack.addControl(enterButton);



       





        


        







    
    }


}