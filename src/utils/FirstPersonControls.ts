import { Camera, Quaternion, Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils";

export default class FirstPersonControls {
  private _htmlElement: HTMLElement;
  private _camera: Camera;
  private _translationSpeed: number;
  private _rotationSpeed: number;
  private _input: InputController;
  private _translation: Vector3;
  private _rotation: Quaternion;
  private _phi: number;
  private _theta: number;

  constructor(
    camera: Camera,
    htmlElement: HTMLElement,
    translationSpeed?: number,
    rotationSpeed?: number
  ) {
    this._htmlElement = htmlElement;
    this._camera = camera;
    this._translationSpeed = translationSpeed || 5;
    this._rotationSpeed = rotationSpeed || 0.1;
    this._input = new InputController();
    this._translation = camera.position.clone();
    this._rotation = camera.quaternion.clone();
    this._phi = 0;
    this._theta = 0;

    // Prevent right click menu
    document.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  update(timeElapsedS: number) {
    if (this._input.isActive()) {
      this._htmlElement.requestPointerLock(); // Lock the cursor

      this._updateCamera(timeElapsedS);
      this._updateRotation(timeElapsedS);
      this._updateTranslation(timeElapsedS);
    } else {
      document.exitPointerLock(); // Unlock the cursor
    }
  }

  dispose() {
    this._input.dispose();
  }

  private _updateTranslation(timeElapsedS: number) {
    const forwardVelocity =
      (this._input.getKey("w") ? 1 : 0) + (this._input.getKey("s") ? -1 : 0);
    const rightVelocity =
      (this._input.getKey("d") ? 1 : 0) + (this._input.getKey("a") ? -1 : 0);
    const upVecolity =
      (this._input.getKey("e") ? 1 : 0) + (this._input.getKey("q") ? -1 : 0);

    const qx = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      this._phi
    );
    const qz = new Quaternion().setFromAxisAngle(
      new Vector3(1, 0, 0),
      this._theta
    );

    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(qz);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(
      forwardVelocity * timeElapsedS * this._translationSpeed
    );

    const right = new Vector3(1, 0, 0);
    right.applyQuaternion(qz);
    right.applyQuaternion(qx);
    right.multiplyScalar(rightVelocity * timeElapsedS * this._translationSpeed);

    const up = new Vector3(0, 1, 0);
    up.multiplyScalar(upVecolity * timeElapsedS * this._translationSpeed);

    this._translation.add(forward);
    this._translation.add(right);
    this._translation.add(up);
  }

  private _updateRotation(timeElapsedS: number) {
    const mouseDelta = this._input.getCurrentMouseDelta();
    const xh = (mouseDelta.x * Math.PI) / 180;
    const yh = (mouseDelta.y * Math.PI) / 180;

    this._phi += -xh * this._rotationSpeed;
    this._theta = clamp(
      this._theta + -yh * this._rotationSpeed,
      -Math.PI / 3,
      Math.PI / 3
    );

    const qx = new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      this._phi
    );
    const qz = new Quaternion().setFromAxisAngle(
      new Vector3(1, 0, 0),
      this._theta
    );

    const q = new Quaternion().multiplyQuaternions(qx, qz);

    this._camera.quaternion.copy(q);
  }

  private _updateCamera(timeElapsedS: number) {
    this._camera.position.copy(this._translation);
    this._camera.quaternion.copy(this._rotation);
  }
}

class InputController {
  private _isActive: boolean = false;
  private _mouseDelta: {
    x: number;
    y: number;
  } = {
    x: 0,
    y: 0,
  };
  private _keys: { [key: string]: boolean } = {};

  constructor() {
    this._initialize();
  }

  getCurrentMouseDelta(): { x: number; y: number } {
    return this._mouseDelta;
  }

  getKey(key: string): boolean {
    return this._keys[key];
  }

  isActive(): boolean {
    return this._isActive;
  }

  dispose() {
    document.removeEventListener("mousedown", (e) => this._onMouseDown(e));
    document.removeEventListener("mouseup", (e) => this._onMouseUp(e));
    document.removeEventListener("mousemove", (e) => this._onMouseMove(e));
    document.removeEventListener("keydown", (e) => this._onKeyDown(e));
    document.removeEventListener("keyup", (e) => this._onKeyUp(e));
  }

  private _initialize() {
    document.addEventListener("mousedown", (e) => this._onMouseDown(e), false);
    document.addEventListener("mouseup", (e) => this._onMouseUp(e), false);
    document.addEventListener("mousemove", (e) => this._onMouseMove(e), false);
    document.addEventListener("keydown", (e) => this._onKeyDown(e), false);
    document.addEventListener("keyup", (e) => this._onKeyUp(e), false);
  }

  private _onMouseDown(event: MouseEvent) {
    if (event.button === 2) {
      this._isActive = true;
    }
  }

  private _onMouseUp(event: MouseEvent) {
    if (event.button === 2) {
      this._isActive = false;
    }
  }

  private _onMouseMove(event: MouseEvent) {
    this._mouseDelta.x = event.movementX;
    this._mouseDelta.y = event.movementY;
  }

  private _onKeyDown(event: KeyboardEvent) {
    this._keys[event.key] = true;
  }

  private _onKeyUp(event: KeyboardEvent) {
    this._keys[event.key] = false;
  }
}
