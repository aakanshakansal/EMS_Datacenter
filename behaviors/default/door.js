class CabinetActor {
  setup() {
    this.dynamicCards = [];
    this.listen("createCard", this.doCreateCard);
  }

  doCreateCard(cardData) {
    if (this.dynamicCards.indexOf(cardData.name) === -1) {
      this.dynamicCards.push(cardData.name);
      this.createCard(cardData);
    }
  }
}

class CabinetPawn {
  setup() {
    // the 3D object will likely not be loaded yet.
    this.subscribe(this.id, "3dModelLoaded", "modelLoaded");
  }

  modelLoaded() {
    this.object = this.shape.children[0];
    this.object.traverse((obj) => {
      if (typeof obj.name === "string") {
        if (obj.name.search("Door_Hinge") >= 0) {
          this.addDoor(obj);
        }
      }
    });
  }
  addDoor(obj) {
    let m4 = obj.matrixWorld.toArray();

    this.createCard({
      name: obj.name,
      layers: ["pointer", "walk"],
      singleSided: true,
      shadow: true,
      translation: Microverse.m4_getTranslation(m4),
      rotation: Microverse.m4_getRotation(m4),
      scale: [2.1617669989865185, 2.1617669989865185, 2.1617669989865185],
      type: "3d",
      modelType: "glb",
      fileName: "/Door1.glb",
      dataLocation: "../../assets/Door1.glb",
      behaviorModules: ["Hinge"],
    });
  }

  createCard(cardDef) {
    this.say("createCard", cardDef);
  }
}

export default {
  modules: [
    {
      name: "Cabinet",
      actorBehaviors: [CabinetActor],
      pawnBehaviors: [CabinetPawn],
    },
  ],
};
