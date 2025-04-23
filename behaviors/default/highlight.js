// update code for multiplayer
import { PawnBehavior } from "../PrototypeBehavior";
import * as THREE from "three";

class HighlightPawn extends PawnBehavior {
  setup() {
    this.allowedObjectsHighlight = new Set();
    this.originalMaterialsHighlight = new Map();
    this.highlightedObject = null;
    this.subscribe(this.id, "3dModelLoaded", "ModelLoadedHighlight");

    this.addEventListener("pointerTap", "onTap");

    console.log("HighlightPawn setup");
  }

  ModelLoadedHighlight() {
    if (
      !this.shape ||
      !this.shape.children ||
      this.shape.children.length === 0
    ) {
      console.error("Shape or children are not properly defined.");
      return;
    }
    console.log("HighlightPawn ModelLoaded");

    this.objectHighlight = this.shape.children[0]; // Set the main object to highlight
    console.log("Model Highlight is", this.objectHighlight);
    this.objectHighlight.children.forEach((child, index) => {
      if (!this.isInSkippedRange(child)) {
        // Skip objects in the skipped range
        this.allowedObjectsHighlight.add(child);
        // child.children.forEach((subchild, subIndex) => {
        //   if (subIndex >= 0 && subIndex <= 14) {
        //     this.allowedObjectsHighlight.add(subchild);
        //   }
        // });
      }
    });

    console.log(
      "Allowed Objects for Highlighting:",
      this.allowedObjectsHighlight
    );
  }

  onTap(event) {
    console.log("HighlightPawn onDocumentMouseClick");

    let avatar = this.getMyAvatar();
    let raycaster = avatar.setRaycastFrom2D(event.xy);

    // Intersect only with allowed objects
    const intersects = raycaster.intersectObjects(
      Array.from(this.allowedObjectsHighlight),
      true
    );

    if (intersects.length > 0) {
      const clickedObjectHighlight = intersects[0].object;
      console.log("Clicked Object:", clickedObjectHighlight);
      console.log("Clicked Object Name:", clickedObjectHighlight.name);

      // Check if the clicked object is in the skipped range
      if (this.isInSkippedRange(clickedObjectHighlight)) {
        console.log(
          "Clicked object is in the skipped range and will be skipped."
        );
        return;
      }

      // Highlight logic
      if (this.highlightedObject === clickedObjectHighlight) {
        this.resetObjectMaterial(clickedObjectHighlight);
        // this.stopSpeaking();
        this.highlightedObject = null;
        console.log("Highlight reset on the same object.");
      } else {
        if (this.highlightedObject) {
          this.resetObjectMaterial(this.highlightedObject);
          // this.stopSpeaking();
          console.log("Previous highlight reset:", this.highlightedObject.name);
        }

        this.highlightObject(clickedObjectHighlight);
        // this.speakObjectByName(clickedObjectHighlight.name);
        this.highlightedObject = clickedObjectHighlight;
        console.log("Object is highlighted.");
      }

      this.say("clicked", { clickedObjectName: clickedObjectHighlight.name });
    } else {
      // Reset highlight if no object is clicked
      if (this.highlightedObject) {
        this.resetObjectMaterial(this.highlightedObject);
        // this.stopSpeaking();
        this.highlightedObject = null;
      }
    }
  }

  isDescendantOf(parent, child) {
    if (!parent.children || parent.children.length === 0) return false;
    for (let subChild of parent.children) {
      if (subChild === child || this.isDescendantOf(subChild, child)) {
        return true;
      }
    }
    return false;
  }

  // Function to determine if an object is in the skipped range
  isInSkippedRange(object) {
    // Define skipped ranges
    const skippedRanges = [
      { start: 0, end: 2 },
      { start: 4, end: 18 },
    ];

    // Check if the object is within any of the skipped ranges
    for (const range of skippedRanges) {
      for (let i = range.start; i <= range.end; i++) {
        if (
          object === this.objectHighlight.children[i] ||
          this.isDescendantOf(this.objectHighlight.children[i], object)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  highlightObject(object) {
    if (!this.originalMaterialsHighlight.has(object)) {
      this.originalMaterialsHighlight.set(object, object.material.clone());
    }

    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
    });
    object.material = highlightMaterial;
  }

  resetObjectMaterial(object) {
    if (this.originalMaterialsHighlight.has(object)) {
      object.material = this.originalMaterialsHighlight.get(object);
    }
  }
}

export default {
  modules: [
    {
      name: "Highlight",
      // actorBehaviors: [HighlightActor],
      pawnBehaviors: [HighlightPawn],
    },
  ],
};
