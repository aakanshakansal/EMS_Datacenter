class CabinetActor {
  setup() {
    this.dynamicCards = [];
    this.listen("createCard", this.doCreateCard);
  }

  doCreateCard(cardData) {
    if (this.dynamicCards.indexOf(cardData.name) === -1) {
      this.dynamicCards.push(cardData.name); // add it here
      //cardData.parent = this; // set the parent (?)
      //console.log(cardData);
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
    // console.log("Cabinet", this.object)
    this.object.traverse((obj) => {
      if (typeof obj.name === "string") {
        if (obj.name.search("Server_Rack") >= 0) {
        } else if (obj.name.search("server") >= 0) {
          if (obj.name.search("Blue") >= 0) {
            this.addLights(
              obj,
              [
                0x00ff00, 0x0000ff, 0x00ff00, 0x00ff00, 0x0000ff, 0x00ff00,
                0x0000ff, 0x00ff00,
              ]
            );
          } else {
            this.addLights(obj, [0x00ff00]);
          }
        } else if (obj.name.search("Blue") >= 0) {
          this.addLights(obj, 0x0000ff);
        } else if (obj.name.search("Door_Hinge") >= 0) {
          this.addDoor(obj);
        }
      }
    });
    // this.listen("updateWorld", this.update);
  }

  addLights(obj, colors) {
    //console.log(obj.name, colors);
  }
  addDoor(obj) {
    let m4 = obj.matrixWorld.toArray(); // FIXED: define m4 here

    let originalTranslation = Microverse.m4_getTranslation(m4);

    // Displace slightly, e.g., +0.5 on X-axis
    let displacedTranslation = [
      originalTranslation[0],
      originalTranslation[1],
      originalTranslation[2],
    ];

    this.createCard({
      name: obj.name,
      layers: ["pointer", "walk"],
      singleSided: true,
      shadow: true,
      translation: displacedTranslation,
      rotation: Microverse.m4_getRotation(m4),
      scale: [2.1617669989865185, 2.1617669989865185, 2.1617669989865185],
      type: "3d",
      modelType: "glb",
      fileName: "/Door.glb",
      dataLocation: "../../assets/Door.glb",
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
