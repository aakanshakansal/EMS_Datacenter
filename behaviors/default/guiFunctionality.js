class GuiFunctionalityPawn {
  setup() {
    this.allowObjectForGUIis = new Set();
    this.subscribe(this.id, "3dModelLoaded", "ModelLoadedGUI");
  }

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
      const particleCount = 1200;
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

      gui.closed = true;
      var obj1 = {
        traverseAndColor1: false,
      };

      // window.gui
      //   .add(obj1, "traverseAndColor1")
      //   .name("Rack wise Temp")
      //   .onChange(function (value) {
      //     if (value) {
      //       for (let i = 0; i <= 70; i++) {
      //         if (i >= 5 && i <= 15) {
      //           continue;
      //         }
      //         colorIndex = i;
      //         traverseAndColor1(model.children[i].children[0], false);
      //       }
      //       rackImage.style.display = "block";
      //     } else {
      //       for (let i = 0; i <= 70; i++) {
      //         if (i >= 5 && i <= 15) {
      //           continue;
      //         }
      //         traverseAndColor1(model.children[i].children[0], true);
      //       }
      //       rackImage.style.display = "none";
      //     }
      //   });
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
                model.children[18].children[i],
                texturePath,
                restore
              );
            }
          };
          if (value) {
            applyOrRestore(0, 12, texturePaths[0], false);
            applyOrRestore(25, 40, texturePaths[1], false);
            applyOrRestore(13, 25, texturePaths[2], false);
            applyOrRestore(41, 55, texturePaths[3], false);
            applyOrRestore(56, 71, texturePaths[4], false);
            applyOrRestore(72, 84, texturePaths[0], false);
            applyOrRestore(103, 117, texturePaths[1], false);
            applyOrRestore(85, 102, texturePaths[2], false);
            applyOrRestore(118, 134, texturePaths[3], false);
            applyOrRestore(135, 149, texturePaths[4], false);
            rackImage.style.display = "block";
          } else {
            applyOrRestore(0, 12, "", true);
            applyOrRestore(25, 40, "", true);
            applyOrRestore(13, 25, "", true);
            applyOrRestore(41, 55, "", true);
            applyOrRestore(56, 71, "", true);
            applyOrRestore(72, 84, "", true);
            applyOrRestore(103, 117, "", true);
            applyOrRestore(85, 102, "", true);
            applyOrRestore(118, 134, "", true);
            applyOrRestore(135, 149, "", true);

            // applyOrRestore(0, 10, "", true);
            // applyOrRestore(11, 22, "", true);
            // applyOrRestore(23, 34, "", true);
            // applyOrRestore(35, 46, "", true);
            // applyOrRestore(47, 59, "", true);
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
            "assets/arsr1 (1).glb",
            (gltf) => {
              loadedModel = gltf.scene;
              loadedModel.position.set(15.8, -1.5, 7.07);
              const scaleFactor = 2;
              loadedModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group.add(loadedModel);

              console.log("Loaded model: ", loadedModel);
              const clock = new THREE.Clock();

              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadedModel);

                // Filter out animations you don't want to play
                const excludedAnimations = ["Arrow.006Action"]; // Names of animations to exclude
                const excludedIndices = [2]; // Indices of animations to exclude

                gltf.animations.forEach((clip, index) => {
                  if (
                    !excludedAnimations.includes(clip.name) &&
                    !excludedIndices.includes(index)
                  ) {
                    const action = mixer.clipAction(clip);
                    action.setEffectiveTimeScale(0.35); // Adjust playback speed
                    action.play();
                  } else {
                    console.log(`Excluded animation: ${clip.name}`);
                  }
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

      let loadedModel2 = null;
      const group2 = new THREE.Group();
      scene.add(group2);

      function loadModel2() {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/"
        );
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
          gltfLoader.load(
            "assets/arsr1 (1).glb",
            (gltf) => {
              loadedModel2 = gltf.scene;
              loadedModel2.position.set(4, -1.5, 7.07);
              const scaleFactor = 2;
              loadedModel2.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group2.add(loadedModel2);

              console.log("Loaded model: ", loadedModel2);
              const clock = new THREE.Clock();

              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadedModel2);

                // Filter out animations you don't want to play
                const excludedAnimations = ["Arrow.006Action"]; // Names of animations to exclude
                const excludedIndices = [2]; // Indices of animations to exclude

                gltf.animations.forEach((clip, index) => {
                  if (
                    !excludedAnimations.includes(clip.name) &&
                    !excludedIndices.includes(index)
                  ) {
                    const action = mixer.clipAction(clip);
                    action.setEffectiveTimeScale(0.35); // Adjust playback speed
                    action.play();
                  } else {
                    console.log(`Excluded animation: ${clip.name}`);
                  }
                });

                function animate() {
                  requestAnimationFrame(animate);
                  if (loadedModel2) {
                    const delta = clock.getDelta();
                    mixer.update(delta);
                  }
                }

                animate();
              } else {
                console.log("No animations found in this model.");
              }
              resolve(loadedModel2);
            },
            null,
            (error) => {
              reject(error);
            }
          );
        });
      }

      let loadedModel3 = null;
      const group3 = new THREE.Group();
      scene.add(group3);

      function loadModel3() {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/"
        );
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
          gltfLoader.load(
            "assets/arsr1 (1).glb",
            (gltf) => {
              loadedModel3 = gltf.scene;
              loadedModel3.position.set(-8, -1.5, 7.07);
              const scaleFactor = 2;
              loadedModel3.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group3.add(loadedModel3);

              console.log("Loaded model: ", loadedModel3);
              const clock = new THREE.Clock();

              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadedModel3);

                // Filter out animations you don't want to play
                const excludedAnimations = ["Arrow.006Action"]; // Names of animations to exclude
                const excludedIndices = [2]; // Indices of animations to exclude

                gltf.animations.forEach((clip, index) => {
                  if (
                    !excludedAnimations.includes(clip.name) &&
                    !excludedIndices.includes(index)
                  ) {
                    const action = mixer.clipAction(clip);
                    action.setEffectiveTimeScale(0.35); // Adjust playback speed
                    action.play();
                  } else {
                    console.log(`Excluded animation: ${clip.name}`);
                  }
                });

                function animate() {
                  requestAnimationFrame(animate);
                  if (loadedModel3) {
                    const delta = clock.getDelta();
                    mixer.update(delta);
                  }
                }

                animate();
              } else {
                console.log("No animations found in this model.");
              }
              resolve(loadedModel3);
            },
            null,
            (error) => {
              reject(error);
            }
          );
        });
      }

      let loadedModel4 = null;
      const group4 = new THREE.Group();
      scene.add(group4);

      function loadModel4() {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/"
        );
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
          gltfLoader.load(
            "assets/arsr2 (2).glb",
            (gltf) => {
              loadedModel4 = gltf.scene;
              loadedModel4.position.set(-1.5, -1.5, 7.07);
              const scaleFactor = 2;
              loadedModel4.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group4.add(loadedModel4);

              console.log("Loaded model: ", loadedModel4);
              const clock = new THREE.Clock();

              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadedModel4);

                // Filter out animations you don't want to play
                const excludedAnimations = ["Arrow.006Action"]; // Names of animations to exclude
                const excludedIndices = [2]; // Indices of animations to exclude

                gltf.animations.forEach((clip, index) => {
                  if (
                    !excludedAnimations.includes(clip.name) &&
                    !excludedIndices.includes(index)
                  ) {
                    const action = mixer.clipAction(clip);
                    action.setEffectiveTimeScale(0.35); // Adjust playback speed
                    action.play();
                  } else {
                    console.log(`Excluded animation: ${clip.name}`);
                  }
                });

                function animate() {
                  requestAnimationFrame(animate);
                  if (loadedModel4) {
                    const delta = clock.getDelta();
                    mixer.update(delta);
                  }
                }

                animate();
              } else {
                console.log("No animations found in this model.");
              }
              resolve(loadedModel4);
            },
            null,
            (error) => {
              reject(error);
            }
          );
        });
      }

      let loadedModel5 = null;
      const group5 = new THREE.Group();
      scene.add(group5);

      function loadModel5() {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/"
        );
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
          gltfLoader.load(
            "assets/arsr2 (2).glb",
            (gltf) => {
              loadedModel5 = gltf.scene;
              loadedModel5.position.set(-13.4, -1.5, 7.07);
              const scaleFactor = 2;
              loadedModel5.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group5.add(loadedModel5);

              console.log("Loaded model: ", loadedModel5);
              const clock = new THREE.Clock();

              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadedModel5);

                // Filter out animations you don't want to play
                const excludedAnimations = ["Arrow.006Action"]; // Names of animations to exclude
                const excludedIndices = [2]; // Indices of animations to exclude

                gltf.animations.forEach((clip, index) => {
                  if (
                    !excludedAnimations.includes(clip.name) &&
                    !excludedIndices.includes(index)
                  ) {
                    const action = mixer.clipAction(clip);
                    action.setEffectiveTimeScale(0.35); // Adjust playback speed
                    action.play();
                  } else {
                    console.log(`Excluded animation: ${clip.name}`);
                  }
                });

                function animate() {
                  requestAnimationFrame(animate);
                  if (loadedModel5) {
                    const delta = clock.getDelta();
                    mixer.update(delta);
                  }
                }

                animate();
              } else {
                console.log("No animations found in this model.");
              }
              resolve(loadedModel5);
            },
            null,
            (error) => {
              reject(error);
            }
          );
        });
      }

      let loadedModel6 = null;
      const group6 = new THREE.Group();
      scene.add(group6);

      function loadModel6() {
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/libs/draco/"
        );
        const gltfLoader = new THREE.GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);

        return new Promise((resolve, reject) => {
          gltfLoader.load(
            "assets/arsr2 (2).glb",
            (gltf) => {
              loadedModel6 = gltf.scene;
              loadedModel6.position.set(10.45, -1.5, 7.07);
              const scaleFactor = 2;
              loadedModel6.scale.set(scaleFactor, scaleFactor, scaleFactor);
              group6.add(loadedModel6);

              console.log("Loaded model: ", loadedModel6);
              const clock = new THREE.Clock();

              if (gltf.animations && gltf.animations.length > 0) {
                console.log("Animations found:", gltf.animations);
                const mixer = new THREE.AnimationMixer(loadedModel6);

                // Filter out animations you don't want to play
                const excludedAnimations = ["Arrow.006Action"]; // Names of animations to exclude
                const excludedIndices = [2]; // Indices of animations to exclude

                gltf.animations.forEach((clip, index) => {
                  if (
                    !excludedAnimations.includes(clip.name) &&
                    !excludedIndices.includes(index)
                  ) {
                    const action = mixer.clipAction(clip);
                    action.setEffectiveTimeScale(0.35); // Adjust playback speed
                    action.play();
                  } else {
                    console.log(`Excluded animation: ${clip.name}`);
                  }
                });

                function animate() {
                  requestAnimationFrame(animate);
                  if (loadedModel6) {
                    const delta = clock.getDelta();
                    mixer.update(delta);
                  }
                }

                animate();
              } else {
                console.log("No animations found in this model.");
              }
              resolve(loadedModel6);
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

      function removeModel2() {
        if (loadedModel2) {
          group2.remove(loadedModel2);
          loadedModel2 = null;
        }
      }
      function removeModel3() {
        if (loadedModel3) {
          group3.remove(loadedModel3);
          loadedModel3 = null;
        }
      }

      function removeModel4() {
        if (loadedModel4) {
          group4.remove(loadedModel4);
          loadedModel4 = null;
        }
      }

      function removeModel5() {
        if (loadedModel5) {
          group5.remove(loadedModel5);
          loadedModel5 = null;
        }
      }

      function removeModel6() {
        if (loadedModel6) {
          group6.remove(loadedModel6);
          loadedModel6 = null;
        }
      }

      window.gui
        .add(obj3, "traverse")
        .name("Hvac Convection ")
        .onChange(function (value) {
          if (value) {
            loadModel5();
            loadModel6();
            loadModel4();
            loadModel2();
            loadModel3();
            loadModel().then(() => {});
            rackImage.style.display = "block";
          } else {
            removeModel();
            removeModel2();
            removeModel3();
            removeModel4();
            removeModel5();
            removeModel6();

            rackImage.style.display = "none";
          }
        });

      const obj6 = {
        createTemperatureSimulation: false,
      };

      let temperatureSimulations = [];
      const simulationRanges = [
        [[3, 8.4], 5, [-2.8, 7]],
        [[15, 8.4], 5, [-2.8, 7]],
        [[-12.5, -8.4], 5, [-2.8, 7]],
        [[-0.5, -8.4], 5, [-2.8, 7]],
        [[3, 8.4], 5, [9.3, 7.7]],
        [[15, 8.4], 5, [9.3, 7.7]],
        [[-12.5, -8.4], 5, [9.3, 7.7]],
        [[-0.5, -8.4], 5, [9.3, 7.7]],
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

        // speechSynthesis.speak(speech);

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

  // resetObjectColor(object) {
  //   // Get the specific child (children[79])
  //   const colorChange = this.ModelGUI.children[79];

  //   if (!colorChange) {
  //     console.error("Child at index 79 (colorChange) not found.");
  //     return;
  //   }

  //   // Traverse through all objects in the hierarchy
  //   object.traverse((child) => {
  //     if (child.isMesh) {
  //       if (
  //         child === colorChange || // Check if this is the target object
  //         colorChange.children.includes(child) // Check if this is a child of the target object
  //       ) {
  //         // Set the color to black for colorChange and its children
  //         child.material.color.set(0x000000); // Black
  //         child.material.needsUpdate = true; // Ensure the material is updated
  //       } else {
  //         // Reset the color for all other objects
  //         child.material.color.set(child.userData.originalColor || 0xffffff); // Original color or white
  //         child.material.needsUpdate = true; // Ensure the material is updated
  //       }
  //     }
  //   });
  // }
  colorchange() {
    const colorChange = this.ModelGUI.children[79];

    if (!colorChange) {
      console.error("Child at index 79 (colorChange) not found.");
      return;
    }

    // Traverse the specific child and its descendants to set color to black
    colorChange.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set(0x000000); // Black
        child.material.needsUpdate = true;
      }
    });
  }

  resetObjectColor(object) {
    const colorChange = this.ModelGUI.children[79];

    if (!colorChange) {
      console.error("Child at index 79 (colorChange) not found.");
      return;
    }

    // Traverse all objects in the hierarchy
    object.traverse((child) => {
      if (child.isMesh) {
        if (
          child === colorChange || // Target colorChange
          colorChange.children.includes(child) // Target its sub-children
        ) {
          // Leave this to the colorChange logic
          return;
        }

        // Reset all other objects to their original color
        child.material.color.set(child.userData.originalColor || 0xffffff);
        child.material.needsUpdate = true; // Ensure material updates
      }
    });

    // After resetting others, apply black to colorChange and its children
    this.colorchange();
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
