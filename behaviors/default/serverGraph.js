// // // class ServerInfoPawn {
// // //   setup() {
// // //     this.allowedObjectsServer = new Set();
// // //     this.lastClickedObjectServer = null;
// // //     this.subscribe(this.id, "3dModelLoaded", "ModelLoadedServer");
// // //     console.log("serverInfo setup ");
// // //     this.addEventListener("pointerTap", "onTapserver");
// // //   }
// // //   ModelLoadedServer() {
// // //     if (
// // //       !this.shape ||
// // //       !this.shape.children ||
// // //       this.shape.children.length === 0
// // //     ) {
// // //       console.error("Shape or children are not properly defined.");
// // //       return;
// // //     }
// // //     console.log("HighlightPawn ModelLoaded");

// // //     this.objectServer = this.shape.children[0];
// // //     if (!this.objectServer) {
// // //       console.error("No valid object found in shape's children.");
// // //       return;
// // //     }
// // //     console.log("Model server is", this.objectServer);

// // //     this.allowedObjectsServer.add(this.objectServer);
// // //   }

// // //   onTapserver(event) {
// // //     let avatar = this.getMyAvatar();
// // //     let raycaster = avatar.setRaycastFrom2D(event.xy);

// // //     // Perform raycasting but filter out the glass object (child index 14)
// // //     const intersects = raycaster.intersectObjects(
// // //       this.objectServer.children,
// // //       true
// // //     );

// // //     if (intersects.length > 0) {
// // //       let clickedObjectServer = intersects[0].object;

// // //       // Check if the clicked object is "glass"
// // //       // if (this.isGlassObject(clickedObjectServer)) {
// // //       //   console.log("Glass object clicked. Skipping selection.");

// // //       //   // Remove the glass object and check for objects behind it
// // //       //   intersects.shift();
// // //       if (intersects.length > 0) {
// // //         clickedObjectServer = intersects[0].object; // Select the next object behind the glass
// // //         console.log("Behind glass, selected object is:", clickedObjectServer);
// // //       } else {
// // //         console.log("No object behind glass.");
// // //         return;
// // //       }
// // //     }

// // //     // Check if the same object is clicked again
// // //     if (this.lastClickedObjectServer === clickedObjectServer) {
// // //       this.hideAllInfo();
// // //       // this.hideAllDiv();
// // //       this.lastClickedObjectServer = null; // Reset lastClickedObject
// // //       return;
// // //     }

// // //     this.lastClickedObjectServer = clickedObjectServer; // Update last clicked object

// // //     let isRack = false;
// // //     let isServer = false;

// // //     for (let i = 3; i <= 149; i++) {
// // //       if (clickedObjectServer === this.objectServer.children[i].children[12]) {
// // //         if (i >= 4 && i <= 18) {
// // //           continue;
// // //         }
// // //         isRack = true;
// // //         break;
// // //       }
// // //     }

// // //     if (isRack) {
// // //       this.serverinfo(clickedObjectServer);
// // //     } else {
// // //       for (let i = 3; i <= 149; i++) {
// // //         if (i >= 4 && i <= 18) {
// // //           continue;
// // //         } else {
// // //           for (let j = 0; j <= 11; j++) {
// // //             // if (j === 0) continue;

// // //             for (let k = 0; k <= 1; k++) {
// // //               if (
// // //                 clickedObjectServer ===
// // //                 this.objectServer.children[i].children[j]
// // //               ) {
// // //                 console.log(
// // //                   this.objectServer.children[i].children[j].children[k],
// // //                   "server info clicked "
// // //                 );
// // //                 isServer = true;
// // //                 break;
// // //               }
// // //             }
// // //           }
// // //         }
// // //       }

// // //       if (isServer) {
// // //         this.serverinfo(clickedObjectServer);
// // //       } else {
// // //         this.hideAllInfo();
// // //         // this.hideAllDiv();
// // //         this.hideServerInfo();
// // //       }
// // //     }
// // //   }

// // //   // hideAllDiv() {
// // //   //   this.loadingIndicator = document.getElementById("loadingIndicator");
// // //   //   this.loadingIndicator.style.display = "none";

// // //   //   this.loadingContainer1 = document.getElementById("loadingContainer1");
// // //   //   this.loadingContainer1.style.display = "none";

// // //   //   this.loadingMessage = document.getElementById("loadingMessage");
// // //   //   this.loadingMessage.style.display = "none";
// // //   // }

// // //   serverinfo(server) {
// // //     const serverInfo = document.getElementById("serverInfo");
// // //     serverInfo.innerHTML = `
// // //                 <h3>${server.name || "N/A"} Info</h3>
// // //                 <p>Name: ${server.name || "N/A"}</p>

// // //                 <hr>
// // //             `;
// // //     serverInfo.style.left = "10px"; // Set position to fixed values for now
// // //     serverInfo.style.top = "10px";
// // //     serverInfo.style.display = "block";
// // //   }

// // //   hideServerInfo() {
// // //     const serverInfo = document.getElementById("serverInfo");
// // //     serverInfo.style.display = "none";
// // //   }

// // //   hideAllInfo() {
// // //     this.hideServerInfo();
// // //   }
// // // }

// // // export default {
// // //   modules: [
// // //     {
// // //       name: "ServerInfo",
// // //       pawnBehaviors: [ServerInfoPawn],
// // //     },
// // //   ],
// // // };
// // class ServerInfoPawn {
// //   setup() {
// //     this.allowedObjectsServer = new Set();
// //     this.lastClickedObjectServer = null;
// //     this.objectServer = null; // Initialize as null
// //     this.subscribe(this.id, "3dModelLoaded", "ModelLoadedServer");
// //     console.log("serverInfo setup ");
// //     this.addEventListener("pointerTap", "onTapserver");
// //   }

// //   ModelLoadedServer() {
// //     if (
// //       !this.shape ||
// //       !this.shape.children ||
// //       this.shape.children.length === 0
// //     ) {
// //       console.error("Shape or children are not properly defined.");
// //       return;
// //     }
// //     console.log("HighlightPawn ModelLoaded");

// //     this.objectServer = this.shape.children[0];
// //     if (!this.objectServer) {
// //       console.error("No valid object found in shape's children.");
// //       return;
// //     }
// //     console.log("Model server is", this.objectServer);

// //     this.allowedObjectsServer.add(this.objectServer);
// //   }

// //   onTapserver(event) {
// //     // Check if objectServer is loaded
// //     if (!this.objectServer || !this.objectServer.children) {
// //       console.error("3D model not loaded yet or failed to load");
// //       return;
// //     }

// //     let avatar = this.getMyAvatar();
// //     let raycaster = avatar.setRaycastFrom2D(event.xy);

// //     // Perform raycasting
// //     const intersects = raycaster.intersectObjects(
// //       this.objectServer.children,
// //       true
// //     );

// //     if (intersects.length === 0) {
// //       this.hideAllInfo();
// //       return;
// //     }

// //     let clickedObjectServer = intersects[0].object;

// //     // Check if the same object is clicked again
// //     if (this.lastClickedObjectServer === clickedObjectServer) {
// //       this.hideAllInfo();
// //       this.lastClickedObjectServer = null;
// //       return;
// //     }

// //     this.lastClickedObjectServer = clickedObjectServer;

// //     let isRack = false;
// //     let isServer = false;

// //     // Check if it's a rack
// //     for (let i = 3; i <= 149; i++) {
// //       if (i >= 4 && i <= 18) continue;

// //       const child = this.objectServer.children[i];
// //       if (!child || !child.children) continue;

// //       if (clickedObjectServer === child.children[12]) {
// //         isRack = true;
// //         break;
// //       }
// //     }

// //     if (isRack) {
// //       this.serverinfo(clickedObjectServer);
// //       return;
// //     }

// //     // Check if it's a server
// //     for (let i = 3; i <= 149; i++) {
// //       if (i >= 4 && i <= 18) continue;

// //       const child = this.objectServer.children[i];
// //       if (!child || !child.children) continue;

// //       for (let j = 0; j <= 11; j++) {
// //         if (clickedObjectServer === child.children[j]) {
// //           isServer = true;
// //           break;
// //         }
// //       }
// //       if (isServer) break;
// //     }

// //     if (isServer) {
// //       this.serverinfo(clickedObjectServer);
// //     } else {
// //       this.hideAllInfo();
// //     }
// //   }

// //   serverinfo(server) {
// //     const serverInfo = document.getElementById("serverInfo");
// //     if (!serverInfo) {
// //       console.error("serverInfo element not found");
// //       return;
// //     }

// //     serverInfo.innerHTML = `
// //       <h3>${server.name || "N/A"} Info</h3>
// //       <p>Name: ${server.name || "N/A"}</p>
// //       <hr>
// //     `;
// //     serverInfo.style.left = "10px";
// //     serverInfo.style.top = "10px";
// //     serverInfo.style.display = "block";
// //   }

// //   hideServerInfo() {
// //     const serverInfo = document.getElementById("serverInfo");
// //     if (serverInfo) {
// //       serverInfo.style.display = "none";
// //     }
// //   }

// //   hideAllInfo() {
// //     this.hideServerInfo();
// //   }
// // }

// // export default {
// //   modules: [
// //     {
// //       name: "ServerInfo",
// //       pawnBehaviors: [ServerInfoPawn],
// //     },
// //   ],
// // };
// class ServerInfoPawn {
//   setup() {
//     this.allowedObjectsServer = new Set();
//     this.lastClickedObjectServer = null;
//     this.objectServer = null;
//     this.subscribe(this.id, "3dModelLoaded", "ModelLoadedServer");
//     console.log("serverInfo setup ");
//     this.addEventListener("pointerTap", "onTapserver");
//   }

//   ModelLoadedServer() {
//     if (
//       !this.shape ||
//       !this.shape.children ||
//       this.shape.children.length === 0
//     ) {
//       console.error("Shape or children are not properly defined.");
//       return;
//     }

//     console.log("HighlightPawn ModelLoaded");

//     this.objectServer = this.shape.children[0];

//     if (!this.objectServer) {
//       console.error("No valid object found in shape's children.");
//       return;
//     }

//     console.log("Model server is", this.objectServer);

//     this.allowedObjectsServer.add(this.objectServer);
//   }

//   onTapserver(event) {
//     if (!this.objectServer || !this.objectServer.children) {
//       console.error("3D model not loaded yet or failed to load");
//       return;
//     }

//     let avatar = this.getMyAvatar();
//     let raycaster = avatar.setRaycastFrom2D(event.xy);
//     const intersects = raycaster.intersectObjects(
//       this.objectServer.children,
//       true
//     );

//     if (intersects.length === 0) {
//       this.hideAllInfo();
//       return;
//     }

//     let clickedObjectServer = intersects[0].object;

//     if (this.lastClickedObjectServer === clickedObjectServer) {
//       this.hideAllInfo();
//       this.lastClickedObjectServer = null;
//       return;
//     }

//     this.lastClickedObjectServer = clickedObjectServer;

//     let isRack = false;
//     let isServer = false;

//     for (let i = 3; i <= 149; i++) {
//       if (i >= 4 && i <= 18) continue;

//       const child = this.objectServer.children[i];
//       if (!child || !child.children) continue;

//       if (clickedObjectServer === child.children[12]) {
//         isRack = true;

//         // Assuming child.name or something like that contains "Server_Rack001", etc.
//         const rackName = child.name || child.userData.name || "Unknown_Rack";
//         this.fetchAndDisplayRackData(rackName);
//         return;
//       }
//     }

//     for (let i = 3; i <= 149; i++) {
//       if (i >= 4 && i <= 18) continue;

//       const child = this.objectServer.children[i];
//       if (!child || !child.children) continue;

//       for (let j = 0; j <= 11; j++) {
//         if (clickedObjectServer === child.children[j]) {
//           isServer = true;
//           break;
//         }
//       }
//       if (isServer) break;
//     }

//     if (isServer) {
//       const serverName =
//         clickedObjectServer.name ||
//         clickedObjectServer.userData.name ||
//         "Unknown_Server";
//       this.displaySimpleInfo(serverName);
//     } else {
//       this.hideAllInfo();
//     }
//   }

//   async fetchAndDisplayRackData(rackName) {
//     const serverInfo = document.getElementById("serverInfo");
//     if (!serverInfo) {
//       console.error("serverInfo element not found");
//       return;
//     }

//     const apiUrl = `http://103.204.95.218:6969/api/v1/ems/rack/${rackName}`;

//     try {
//       const response = await fetch(apiUrl);
//       if (!response.ok) {
//         throw new Error(`API error: ${response.statusText}`);
//       }

//       const jsonData = await response.json();
//       const data = jsonData.data;

//       serverInfo.innerHTML = `
//         <h3>${data.rack_name || "N/A"} Info</h3>
//         <p><strong>Row:</strong> ${data.row_name}</p>
//         <p><strong>Servers:</strong> ${data.server_name.join(", ")}</p>
//         <p><strong>IT Power:</strong> ${data.it_power} ${data.it_power_unit}</p>
//         <p><strong>PUE:</strong> ${data.pue} ${data.pue_unit}</p>
//         <p><strong>HVAC Power:</strong> ${data.hvac_power} ${
//         data.hvac_power_unit
//       }</p>
//         <p><strong>Total UPS Power:</strong> ${data.total_ups_power} kW</p>
//         <p><strong>UPS Time:</strong> ${data.total_ups_time} hrs</p>
//         <p><strong>Server Utilization:</strong> ${data.server_utilization}%</p>
//         <p><strong>Temperature Modeling:</strong> ${
//           data.temperature_modeling
//         }°C</p>
//         <p><strong>Network Traffic Usage:</strong> ${
//           data.network_traffic_usage
//         }%</p>
//         <p><strong>CFD:</strong> ${data.cfd}</p>
//         <p><strong>Switch Power:</strong> ${data.switch_power} kW</p>
//         <p><strong>Switch Usage:</strong> ${data.switch_usage}%</p>
//         <p><strong>Last Updated:</strong> ${new Date(
//           data.createdAt
//         ).toLocaleString()}</p>
//         <hr>
//       `;

//       serverInfo.style.left = "10px";
//       serverInfo.style.top = "10px";
//       serverInfo.style.display = "block";
//     } catch (error) {
//       console.error("Failed to fetch server rack data:", error);
//       serverInfo.innerHTML = `<p>Error fetching server info.</p>`;
//       serverInfo.style.display = "block";
//     }
//   }

//   displaySimpleInfo(name) {
//     const serverInfo = document.getElementById("serverInfo");
//     if (!serverInfo) return;

//     serverInfo.innerHTML = `
//       <h3>${name} Info</h3>
//       <p>Name: ${name}</p>
//       <hr>
//     `;
//     serverInfo.style.left = "10px";
//     serverInfo.style.top = "10px";
//     serverInfo.style.display = "block";
//   }

//   hideServerInfo() {
//     const serverInfo = document.getElementById("serverInfo");
//     if (serverInfo) {
//       serverInfo.style.display = "none";
//     }
//   }

//   hideAllInfo() {
//     this.lastClickedObjectServer = null;
//     this.hideServerInfo();
//   }
// }

// export default {
//   modules: [
//     {
//       name: "ServerInfo",
//       pawnBehaviors: [ServerInfoPawn],
//     },
//   ],
// };
class ServerInfoPawn {
  setup() {
    this.allowedObjectsServer = new Set();
    this.lastClickedObjectServer = null;
    this.objectServer = null;
    this.subscribe(this.id, "3dModelLoaded", "ModelLoadedServer");
    console.log("serverInfo setup ");
    this.addEventListener("pointerTap", "onTapserver");
  }

  ModelLoadedServer() {
    if (
      !this.shape ||
      !this.shape.children ||
      this.shape.children.length === 0
    ) {
      console.error("Shape or children are not properly defined.");
      return;
    }
    console.log("HighlightPawn ModelLoaded");

    this.objectServer = this.shape.children[0];
    if (!this.objectServer) {
      console.error("No valid object found in shape's children.");
      return;
    }
    console.log("Model server is", this.objectServer);

    this.allowedObjectsServer.add(this.objectServer);
  }

  onTapserver(event) {
    if (!this.objectServer || !this.objectServer.children) {
      console.error("3D model not loaded yet or failed to load");
      return;
    }

    let avatar = this.getMyAvatar();
    let raycaster = avatar.setRaycastFrom2D(event.xy);

    const intersects = raycaster.intersectObjects(
      this.objectServer.children,
      true
    );

    if (intersects.length === 0) {
      this.hideAllInfo();
      return;
    }

    let clickedObjectServer = intersects[0].object;

    if (this.lastClickedObjectServer === clickedObjectServer) {
      this.hideAllInfo();
      this.lastClickedObjectServer = null;
      return;
    }

    this.lastClickedObjectServer = clickedObjectServer;

    let isRack = false;
    let isServer = false;

    for (let i = 3; i <= 149; i++) {
      if (i >= 4 && i <= 18) continue;

      const child = this.objectServer.children[i];
      if (!child || !child.children) continue;

      if (clickedObjectServer === child.children[12]) {
        isRack = true;
        break;
      }
    }

    if (isRack) {
      this.serverinfo(clickedObjectServer);
      return;
    }

    for (let i = 3; i <= 149; i++) {
      if (i >= 4 && i <= 18) continue;

      const child = this.objectServer.children[i];
      if (!child || !child.children) continue;

      for (let j = 0; j <= 11; j++) {
        if (clickedObjectServer === child.children[j]) {
          isServer = true;
          break;
        }
      }
      if (isServer) break;
    }

    if (isServer) {
      this.serverinfo(clickedObjectServer);
    } else {
      this.hideAllInfo();
    }
  }

  async serverinfo(serverObject) {
    const serverInfo = document.getElementById("serverInfo");
    if (!serverInfo) {
      console.error("serverInfo element not found");
      return;
    }

    let current = serverObject;
    while (current && !current.name?.startsWith("Server_Rack")) {
      current = current.parent;
    }

    const rackName = current?.name;
    console.log("Resolved rack name:", rackName);

    if (!rackName) {
      console.error("No valid rack name found from clicked object.");
      return;
    }

    const apiUrl = `http://103.204.95.218:6969/api/v1/ems/rack/${rackName}`;
    console.log("Fetching from API:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      const data = jsonData?.data;

      if (!data) {
        console.warn("No data found for rack:", rackName);
        serverInfo.innerHTML = `<p>No data found for ${rackName}</p>`;
        serverInfo.style.display = "block";
        return;
      }

      serverInfo.innerHTML = `
        <h3>${data.rack_name || "N/A"} Info</h3>
        <p><strong>Row:</strong> ${data.row_name}</p>
        <p><strong>Servers:</strong>12 servers</p>
        <p><strong>IT Power:</strong> ${data.it_power} ${data.it_power_unit}</p>
        <p><strong>PUE:</strong> ${data.pue} ${data.pue_unit}</p>
        <p><strong>HVAC Power:</strong> ${data.hvac_power} ${
        data.hvac_power_unit
      }</p>
        <p><strong>Total UPS Power:</strong> ${data.total_ups_power} kW</p>
        <p><strong>UPS Time:</strong> ${data.total_ups_time} hrs</p>
        <p><strong>Server Utilization:</strong> ${data.server_utilization}%</p>
        <p><strong>Temperature Modeling:</strong> ${
          data.temperature_modeling
        }°C</p>
        <p><strong>Network Traffic Usage:</strong> ${
          data.network_traffic_usage
        }%</p>
        <p><strong>CFD:</strong> ${data.cfd}</p>
        
        <p><strong>Last Updated:</strong> ${new Date(
          data.createdAt
        ).toLocaleString()}</p>
        <hr>
      `;

      serverInfo.style.left = "10px";
      serverInfo.style.top = "10px";
      serverInfo.style.display = "block";
    } catch (error) {
      console.error("Failed to fetch server rack data:", error);
      serverInfo.innerHTML = `<p>Error fetching server info.</p>`;
      serverInfo.style.display = "block";
    }
  }

  hideServerInfo() {
    const serverInfo = document.getElementById("serverInfo");
    if (serverInfo) {
      serverInfo.style.display = "none";
    }
  }

  hideAllInfo() {
    this.hideServerInfo();
  }
}

export default {
  modules: [
    {
      name: "ServerInfo",
      pawnBehaviors: [ServerInfoPawn],
    },
  ],
};
