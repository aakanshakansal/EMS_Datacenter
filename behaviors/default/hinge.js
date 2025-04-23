import { PawnBehavior } from "../PrototypeBehavior";
import * as THREE from "three";

class HingeActor {
  setup() {
    if (!("doorYaw" in this)) this.doorYaw = Microverse.q_yaw(this.rotation);
    this.doorState = 0;
    this.doorDelta = 0;
    this.active = false; // Track if this is the active hinge
  }

  toggle() {
    if (!this.active) return; // Only respond if active

    if (this.doorDelta !== 0) {
      this.doorDelta *= -1;
    } else {
      const speed = 0.1;
      this.doorDelta = this.doorState === 0 ? speed : -speed;
      this.tick();
    }
  }

  tick() {
    if (this.doorDelta !== 0) {
      this.doorState += this.doorDelta;
      if (this.doorState < 0) {
        this.doorState = 0;
        this.doorDelta = 0;
      }
      if (this.doorState > 1) {
        this.doorState = 1;
        this.doorDelta = 0;
      }

      const rotation = this.doorYaw - (this.doorState * Math.PI) / 2;
      const q = Microverse.q_euler(0, rotation, 0);
      this.rotateTo(q);

      if (this.doorDelta !== 0) this.future(100).tick();
    }
  }
}

class HingePawn extends PawnBehavior {
  setup() {
    this.subscribe(this.id, "3dModelLoaded", "modelLoaded");
    this.addEventListener("pointerDown", "onPointerDown");
    this.currentActiveHinge = null; // Track currently active hinge
    this.hingeObjects = []; // Store all hinge-able objects
  }

  modelLoaded() {
    this.object = this.shape.children[0];

    // Collect all hinge objects (children 3-134, their first child)
    for (let i = 3; i <= 134; i++) {
      if (this.object.children[i] && this.object.children[i].children[0]) {
        const hingeObj = this.object.children[i].children[0];
        this.hingeObjects.push(hingeObj);

        // Make transparent objects render properly
        hingeObj.traverse((obj) => {
          if (obj.material && obj.material.transparent) {
            obj.renderOrder = 1001;
          }
        });
      }
    }

    console.log(`Found ${this.hingeObjects.length} hinge objects`);
  }

  onPointerDown(p3d) {
    const raycaster = new THREE.Raycaster();
    const camera = this.service("ThreeRenderManager").camera;
    const pointer = p3d.xy;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(this.hingeObjects, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;

      // Find the parent card that has the HingeActor behavior
      let hingeCard = null;
      let obj = clickedObject;
      while (obj && !hingeCard) {
        if (obj.actor && obj.actor.call("HingeActor$HingeActor")) {
          hingeCard = obj.actor;
          break;
        }
        obj = obj.parent;
      }

      if (hingeCard) {
        // Deactivate previous active hinge if exists
        if (this.currentActiveHinge && this.currentActiveHinge !== hingeCard) {
          this.currentActiveHinge.active = false;
        }

        // Activate new hinge
        this.currentActiveHinge = hingeCard;
        hingeCard.active = true;
        hingeCard.call("HingeActor$toggle");
      }
    }
  }
}

export default {
  modules: [
    {
      name: "Hinge",
      actorBehaviors: [HingeActor],
      pawnBehaviors: [HingePawn],
    },
  ],
};
