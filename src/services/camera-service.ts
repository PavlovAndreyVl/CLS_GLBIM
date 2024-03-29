/* eslint-disable @typescript-eslint/member-ordering */
import { Observable, BehaviorSubject } from "rxjs";
import { Object3D, Box3, Vector3, Quaternion, Euler, PerspectiveCamera } from "three";

import { AxisName, Vec4DoubleCS } from "../common-types";
import { CameraControls } from "../helpers/camera-controls";

export class CameraService {
  cameraPositionChange$: Observable<Vec4DoubleCS>;
  private _cameraPositionChanged: BehaviorSubject<Vec4DoubleCS>;

  private _camera: PerspectiveCamera;
  get camera(): PerspectiveCamera {
    return this._camera;
  }

  private _controls: CameraControls;
  private _focusBox = new Box3();

  // rotation
  private _rRadius = 0; // rotation radius (distance from camera to focus point)
  private _rPosFocus = new Vector3(); // focus point position (center of rotation)
  private _rPosRelCamTarget = new Vector3(); // camera target position relative to focus point position
  private _rPosRelCamTemp = new Vector3(); // camera intermediate position relative to focus point position
  // --//--
  private _rEuler = new Euler(); // target euler angles
  private _rQcfSource = new Quaternion(); // orientation from camera starting position to focus point
  private _rQcfTarget = new Quaternion(); // orientation from camera target position to focus point
  private _rQcfTemp = new Quaternion(); // orientation from camera intermediate position to focus point

  private _renderCb: () => void;

  constructor(container: HTMLElement, renderCallback: () => void) {
    this._renderCb = renderCallback;

    const camera = new PerspectiveCamera(75, 1, 1, 10000);  
    camera.position.set(0, 1000, 1000);
    camera.lookAt(0, 0, 0);  

    this._cameraPositionChanged = new BehaviorSubject<Vec4DoubleCS>(Vec4DoubleCS.fromVector3(camera.position));
    this.cameraPositionChange$ = this._cameraPositionChanged.asObservable();      

    const controls = new CameraControls(camera, container);
    controls.addEventListener("change", this.onCameraPositionChange);
    controls.update();

    this._camera = camera;
    this._controls = controls;
  }

  destroy() {
    this._controls.dispose();
    this._cameraPositionChanged.complete();
  }
    
  resize(width: number, height: number) {
    if (this._camera) {
      this._camera.aspect = width / height;
      this._camera.updateProjectionMatrix();
    }
  }

  rotateToFaceTheAxis(axis: AxisName, animate: boolean, toZUp = true) {
    this.prepareRotation(axis, toZUp);
    this.applyRotation(animate);
  }
  
  focusCameraOnObjects(objects: Object3D[], offset = 1.2) { 
    if (!objects?.length) {      
      if (!this._focusBox.isEmpty()) {
        this.focusCameraOnBox(this._focusBox, offset);
      }      
      return;
    }
    
    this._focusBox.makeEmpty();    
    for (const object of objects) {
      this._focusBox.expandByObject(object);
    }      

    this.focusCameraOnBox(this._focusBox, offset);
  }  

  enableControls() {
    this._controls.enablePan = true;
    this._controls.enableRotate = true;
    this._controls.enableZoom = true;
  }

  disableControls() {
    this._controls.enablePan = false;
    this._controls.enableRotate = false;
    this._controls.enableZoom = false;
  }

  private onCameraPositionChange = () => {
    this._cameraPositionChanged.next(Vec4DoubleCS.fromVector3(this._camera.position));
    this._renderCb();
  };

  private focusCameraOnBox(box: Box3, offset: number) {
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    
    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance = maxSize / (2 * Math.atan( Math.PI * this._camera.fov / 360 ));
    const fitWidthDistance = fitHeightDistance / this._camera.aspect;
    const distance = offset * Math.max(fitHeightDistance, fitWidthDistance);
    
    const direction = this._controls.target.clone()
      .sub(this._camera.position)
      .normalize()
      .multiplyScalar(distance);

    this._controls.maxDistance = Math.max(distance * 10, 10000);
    this._controls.target.copy(center);
    
    this._camera.near = Math.min(distance / 100, 1);
    this._camera.far = Math.max(distance * 100, 10000);
    this._camera.updateProjectionMatrix();
    this._camera.position.copy(center).sub(direction);

    this._controls.update();
  }

  //#region rotation to face the axis
  private prepareRotation(axis: AxisName, toZUp: boolean) {
    switch (axis) {
      case "x":
        this._rPosRelCamTarget.set(1, 0, 0);
        this._rEuler.set(0, Math.PI * 0.5, 0);
        break;
      case "y":
        if (toZUp) {          
          this._rPosRelCamTarget.set(0, 0, -1);
          this._rEuler.set(0, Math.PI, 0);
        } else {
          this._rPosRelCamTarget.set(0, 1, 0);
          this._rEuler.set(Math.PI * -0.5, 0, 0);
        }
        break;
      case "z":
        if (toZUp) {
          this._rPosRelCamTarget.set(0, 1, 0);
          this._rEuler.set(Math.PI * -0.5, 0, 0);
        } else {
          this._rPosRelCamTarget.set(0, 0, 1);
          this._rEuler.set(0, 0, 0);
        }
        break;
      case "-x":
        this._rPosRelCamTarget.set(-1, 0, 0);
        this._rEuler.set(0, Math.PI * -0.5, 0);
        break;
      case "-y":
        if (toZUp) {
          this._rPosRelCamTarget.set(0, 0, 1);
          this._rEuler.set(0, 0, 0);
        } else {
          this._rPosRelCamTarget.set(0, -1, 0);
          this._rEuler.set(Math.PI * 0.5, 0, 0);
        }
        break;
      case "-z":
        if (toZUp) {
          this._rPosRelCamTarget.set(0, -1, 0);
          this._rEuler.set(Math.PI * 0.5, 0, 0);
        } else {
          this._rPosRelCamTarget.set(0, 0, -1);
          this._rEuler.set(0, Math.PI, 0);
        }
        break;
      default:
        return;
    }

    this._rPosFocus.copy(this._controls.target);
    this._rRadius = this._camera.position.distanceTo(this._rPosFocus);
    this._rPosRelCamTarget.multiplyScalar(this._rRadius);

    this._rQcfSource.copy(this._camera.quaternion);
    this._rQcfTarget.setFromEuler(this._rEuler);
  }

  private applyRotation(animate: boolean) {    
    if (!animate) {
      this._camera.position.copy(this._rPosFocus).add(this._rPosRelCamTarget);
      this._camera.quaternion.copy(this._rQcfTarget);
      this.onCameraPositionChange();
    } else { 
      const rotationSpeed = 2 * Math.PI; // rad/sec
      const totalTime = this._rQcfSource.angleTo(this._rQcfTarget) / rotationSpeed;
      
      let timeDelta: number; // sec
      let step: number; // rad
      const animationStart = performance.now(); // ms

      const renderRotationFrame = () => {
        // increment step
        timeDelta = (performance.now() - animationStart) / 1000;
        step = timeDelta / totalTime; 
        if (step > 1) {
          step = 1;
        }

        // get intermediate quaternion between source and target positions
        this._rQcfTemp.copy(this._rQcfSource).slerp(this._rQcfTarget, step);    
        // get intermediate camera position relative to focus position 
        this._rPosRelCamTemp.set(0, 0, 1)
          .applyQuaternion(this._rQcfTemp)
          .multiplyScalar(this._rRadius);
  
        // move camera to intermediate position
        this._camera.position.copy(this._rPosFocus)
          .add(this._rPosRelCamTemp);

        // update camera quaternion (make camera look at focus point)
        this._camera.quaternion.copy(this._rQcfTemp);

        // render view
        this.onCameraPositionChange();

        // repeat until intermediate quaternion won't be equal to the target one 
        if (this._rQcfTemp.angleTo(this._rQcfTarget)) {
          window.requestAnimationFrame(() => renderRotationFrame());
        }
      };
      renderRotationFrame();
    }
  }
  //#endregion
}
