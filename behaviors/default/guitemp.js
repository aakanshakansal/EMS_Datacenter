class GuiFunctionalityPawn {
  setup() {
    this.allowObjectForGUIis = new Set();
    this.subscribe(this.id, "3dModelLoaded", "ModelLoadedGUI");
  }

  // ModelLoadedGUI(){
  //     if (!this.shape || !this.shape.children || this.shape.children.length === 0) {
  //                     console.error("Shape or children are not properly defined.");
  //                     return;
  //                 }
  //                 console.log("HighlightPawn ModelLoaded");

  //                 this.ModelGUI = this.shape.children[0];
  //                 console.log("Model GUI is ModelLoadedGUI", this.ModelGUI);
  //                 this.allowObjectForGUIis.add(this.ModelGUI);

  //                 this.Gui()
  // }

  ModelLoadedGUI() {
    if (
      !this.shape ||
      !this.shape.children ||
      this.shape.children.length === 0
    ) {
      console.error("Shape or children are not properly defined.");
      return;
    }
    console.log("HighlightPawn ModelLoaded");

    // Set ModelGUI to the first child
    this.ModelGUI = this.shape.children[0];

    // Add allowed objects based on conditions
    this.ModelGUI.children.forEach((child, index) => {
      if ((index >= 0 && index <= 4) || (index >= 16 && index <= 70)) {
        child.children.forEach((subchild, subIndex) => {
          if (subIndex >= 1 && subIndex <= 12) {
            subchild.children.forEach((SsubChild, Ssubindex) => {
              if (Ssubindex >= 0 && Ssubindex <= 1) {
                this.allowObjectForGUIis.add(SsubChild);
              }
            });
          }
        });
      }
      if ((index >= 0 && index <= 4) || (index >= 16 && index <= 70)) {
        child.children.forEach((subchild, subIndex) => {
          if (subIndex === 0) {
            this.allowObjectForGUIis.add(subchild);
          }
        });
      }
      if (index == 71) {
        child.children.forEach((subchild, subIndex) => {
          if (subIndex >= 0 && subIndex <= 77) {
            this.allowObjectForGUIis.add(subchild);
          }
        });
      }
      if (index == 79) {
        child.children.forEach((subchild, subIndex) => {
          if (subIndex >= 0 && subIndex <= 17) {
            subchild.children.forEach((SsubChild, Ssubindex) => {
              if (Ssubindex >= 0 && Ssubindex <= 2) {
                this.allowObjectForGUIis.add(SsubChild);
              }
            });
          }
        });
      }
    });

    console.log("Model GUI is ModelLoadedGUI", this.ModelGUI);
    this.Gui();
  }

  Gui() {
    const model = this.ModelGUI;
    console.log("Model GUI is", this.ModelGUI);

    let params;
    let temperatureInterval;
    // const allowedObjects = new Set();
    const colors = [
      0xff0e00, 0xff7100, 0xffde2d, 0xfbffff, 0x80f2ff, 0x01aeff, 0x0029ff,
    ];
    for (let i = colors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [colors[i], colors[j]] = [colors[j], colors[i]];
    }

    let colorIndex = 0;

    const originalMaterials = new Map();

    function traverseAndColor1(object, restore = false) {
      if (object.isMesh) {
        if (restore) {
          const originalMaterial = originalMaterials.get(object);
          if (originalMaterial) {
            object.material = originalMaterial;
          }
        } else {
          if (!originalMaterials.has(object)) {
            originalMaterials.set(object, object.material);
          }
          const color = colors[colorIndex % colors.length];
          const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.3,
          });
          object.material = material;
          colorIndex++;
        }
      }

      object.children.forEach((child, index) => {
        if (index >= 0) {
          traverseAndColor1(child, restore);
        }
      });
    }

    function traverseAndColor2(object, texturePath, restore = false) {
      if (object.isMesh) {
        if (restore) {
          const originalMaterial = originalMaterials.get(object);
          if (originalMaterial) {
            object.material = originalMaterial;
          }
        } else {
          if (!originalMaterials.has(object)) {
            originalMaterials.set(object, object.material);
          }
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load(texturePath, (texture) => {
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              opacity: 0.6,
            });
            object.material = material;
          });
        }
      }

      object.children.forEach((child) => {
        traverseAndColor2(child, texturePath, restore);
      });
    }
    function createTemperatureSimulation(group, THREE, xRange, yRange, zRange) {
      const particleCount = 3000;
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(
          new THREE.SphereGeometry(0.02, 1, 1),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        );

        particle.position.set(
          xRange[0] + Math.random() * xRange[1],
          -Math.random() * yRange,
          zRange[0] + Math.random() * zRange[1]
        );
        const temperature = (particle.position.y / 3) * 255;
        particle.material.color.setRGB(
          temperature / 255,
          0,
          (255 - temperature) / 255
        );

        particles.push(particle);
        group.add(particle);
      }
      function removeParticles() {
        particles.forEach((particle) => {
          group.remove(particle);
        });
        particles.length = 0;
      }
      function updateTemperature() {
        particles.forEach((particle) => {
          particle.position.y += 0.01;
          const temperature = (particle.position.y / 3) * 255;
          particle.material.color.setRGB(
            temperature / 255,
            0,
            (255 - temperature) / 255
          );
          if (particle.position.y > 3) {
            particle.position.y = -Math.random() * 3;
          }
        });
        requestAnimationFrame(updateTemperature);
      }
      updateTemperature();
      return {
        remove: removeParticles,
      };
    }

    function init() {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer();

      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);
      camera.position.set(5, 5, 20);
      camera.lookAt(5, 0, 5);
      function animate() {
        requestAnimationFrame(animate);
        updateTemperature();
        renderer.render(scene, camera);
      }
      function updateTemperature() {
        group.children.forEach((particles) => {
          particles.children.forEach((particle) => {
            particle.position.y += 0.01;
            const temperature = (particle.position.y / 3) * 255;
            particle.material.color.setRGB(
              temperature / 255,
              0,
              (255 - temperature) / 255
            );
            if (particle.position.y > 3) {
              particle.position.y = -Math.random() * 3;
            }
          });
        });
      }

      animate();
    }

    init();

    if (!window.gui) {
      window.gui = new dat.GUI();
      const rackImage = document.getElementById("rackImage");
      var obj1 = {
        traverseAndColor1: false,
      };

      window.gui
        .add(obj1, "traverseAndColor1")
        .name("Rack wise Temp")
        .onChange(function (value) {
          if (value) {
            for (let i = 0; i <= 70; i++) {
              if (i >= 5 && i <= 15) {
                continue;
              }
              colorIndex = i;
              traverseAndColor1(model.children[i].children[0], false);
            }
            rackImage.style.display = "block";
          } else {
            for (let i = 0; i <= 70; i++) {
              if (i >= 5 && i <= 15) {
                continue;
              }
              traverseAndColor1(model.children[i].children[0], true);
            }
            rackImage.style.display = "none";
          }
        });
      const obj2 = {
        traverseAndColor2: false,
      };

      const texturePaths = [
        "./assets/images/Texture.jpg",
        "./assets/images/Texture1.jpg",
        "./assets/images/Texture2.jpg",
        "./assets/images/Texture3.jpg",
        "./assets/images/Texture5.jpg",
      ];

      window.gui
        .add(obj2, "traverseAndColor2")
        .name("CFD")
        .onChange(function (value) {
          const applyOrRestore = (start, end, texturePath, restore) => {
            console.log("obj 2 gui model is ", model);
            for (let i = start; i <= end; i++) {
              traverseAndColor2(
                model.children[14].children[i],
                texturePath,
                restore
              );
            }
          };

          if (value) {
            applyOrRestore(0, 10, texturePaths[0], false);
            applyOrRestore(11, 22, texturePaths[1], false);
            applyOrRestore(23, 34, texturePaths[2], false);
            applyOrRestore(35, 46, texturePaths[3], false);
            applyOrRestore(47, 59, texturePaths[4], false);
            rackImage.style.display = "block";
          } else {
            applyOrRestore(0, 10, "", true);
            applyOrRestore(11, 22, "", true);
            applyOrRestore(23, 34, "", true);
            applyOrRestore(35, 46, "", true);
            applyOrRestore(47, 59, "", true);
            rackImage.style.display = "none";
          }
        });
      var obj3 = {
        traverse: false,
      };

      let loadedModel = null;
      const group = new THREE.Group();
      scene.add(group);

      function loadModel() {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/"
        );
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
          gltfLoader.load(
            "assets/Animation.glb",
            (gltf) => {
              loadedModel = gltf.scene;
              loadedModel.position.set(1, -1.5, 0.2);
              const scaleFactor = 2;
              loadedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group.add(loadedModel);
              const clock = new THREE.Clock();
              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadedModel);
                gltf.animations.forEach((clip) => {
                  const action = mixer.clipAction(clip);
                  action.setEffectiveTimeScale(0.35);
                  action.play();
                });
                function animate() {
                  requestAnimationFrame(animate);
                  if (loadedModel) {
                    const delta = clock.getDelta();
                    mixer.update(delta);
                  }
                }

                animate();
              } else {
                console.log("No animations found in this model.");
              }
              resolve(loadedModel);
            },
            null,
            (error) => {
              reject(error);
            }
          );
        });
      }
      function removeModel() {
        if (loadedModel) {
          group.remove(loadedModel);
          loadedModel = null;
        }
      }

      window.gui
        .add(obj3, "traverse")
        .name("Hvac Convection ")
        .onChange(function (value) {
          if (value) {
            loadModel().then(() => {});
            rackImage.style.display = "block";
          } else {
            removeModel();
            rackImage.style.display = "none";
          }
        });

      const obj6 = {
        createTemperatureSimulation: false,
      };

      let temperatureSimulations = [];
      const simulationRanges = [
        [[3, 7.2], 5, [-2, 7]],
        [[13, 5.5], 5, [-2, 7]],
        [[-13, 1], 5, [-2, 7]],
        [[0.1, -9], 5, [-2, 7]],
        [[3, 7.2], 5, [8.5, 8.5]],
        [[13, 5.5], 5, [8.5, 8.5]],
        [[-13, 1], 5, [8.5, 8.5]],
        [[0.1, -9], 5, [8.5, 8.5]],
      ];

      window.gui
        .add(obj6, "createTemperatureSimulation")
        .name("Air Flow")
        .onChange(function (value) {
          if (value) {
            simulationRanges.forEach((range) => {
              const simulation = createTemperatureSimulation(
                group,
                THREE,
                ...range
              );
              temperatureSimulations.push(simulation);
            });
          } else {
            temperatureSimulations.forEach((simulation) => {
              simulation.remove();
            });
            temperatureSimulations = [];
          }
        });

      // ✅ Add Server function
      var obj8 = {
        addServer: false,
      };

      let loadServerModel = null;
      const group1 = new THREE.Group();
      scene.add(group1);

      function loadServerModel1() {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/"
        );
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
          gltfLoader.load(
            "assets/Animation.glb",
            (gltf) => {
              loadServerModel = gltf.scene;
              loadServerModel.position.set(1, -1.5, 0.2);
              const scaleFactor = 2;
              loadServerModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group.add(loadServerModel);
              const clock = new THREE.Clock();
              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadServerModel);
                gltf.animations.forEach((clip) => {
                  const action = mixer.clipAction(clip);
                  action.setEffectiveTimeScale(0.35);
                  action.play();
                });
                function animate() {
                  requestAnimationFrame(animate);
                  if (loadServerModel) {
                    const delta = clock.getDelta();
                    mixer.update(delta);
                  }
                }

                animate();
              } else {
                console.log("No animations found in this model.");
              }
              resolve(loadServerModel);
            },
            null,
            (error) => {
              reject(error);
            }
          );
        });
      }
      function removeServerModel() {
        if (loadServerModel) {
          group.remove(loadServerModel);
          loadServerModel = null;
        }
      }

      window.gui
        .add(obj8, "addServer")
        .name("Add server Model")
        .onChange(function (value) {
          if (value) {
            loadServerModel1().then(() => {});
            rackImage.style.display = "block";
          } else {
            removeServerModel();
            rackImage.style.display = "none";
          }
        });

      params = {
        temperatureThreshold: 50,
        checkTemperature: false,
      };

      window.gui
        .add(params, "temperatureThreshold", 0, 100)
        .name("Temperature Threshold (°C)");
      window.gui
        .add(params, "checkTemperature")
        .name("Temp(CPU)")
        .onChange((value) => {
          if (value) {
            temperatureInterval = setInterval(() => {
              this.allowObjectForGUIis.forEach((object) => {
                console.log("tem rack object is ", object);
                this.checkTemperatureAndUpdateColor(object);
              });
            }, 15000);
          } else {
            clearInterval(temperatureInterval);
            this.allowObjectForGUIis.forEach((object) => {
              this.resetObjectColor(object);
            });
          }
        });
    }
  }

  checkTemperatureAndUpdateColor(object) {
    const temperature = this.generateDynamicTemperature();

    if (temperature > 10) {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(0xff0000);
        }
      });
      const message = `The temperature of ${
        object.name || "this object"
      } is high: ${temperature}°C.`;
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(message);

        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;

        speechSynthesis.speak(speech);

        console.log(message);
      } else {
        console.log("Speech synthesis is not supported in this browser.");
      }
    } else {
      object.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(0xffffff);
        }
      });
    }
  }

  generateDynamicTemperature() {
    return 5 + Math.floor(Math.random() * 11);
  }

  resetObjectColor(object) {
    object.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(child.userData.originalColor || 0xffffff);
      }
    });
  }
}

export default {
  modules: [
    {
      name: "GuiFunctionality",
      pawnBehaviors: [GuiFunctionalityPawn],
    },
  ],
};
