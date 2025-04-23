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
//         break;
//       }
//     }

//     if (isRack) {
//       this.serverinfo(clickedObjectServer);
//       return;
//     }

//     for (let i = 3; i <= 149; i++) {
//       if (i >= 4 && i <= 18) continue;

//       const child = this.objectServer.children[i];
//       if (!child || !child.children) continue;

//       for (let j = 0; j <= 11; j++) {
//         // for (let k = 0; k <= 1; k++) {

//         if (clickedObjectServer === child.children[j].children[1]) {
//           console.log(
//             "child.children[j].children[k])",
//             child.children[j].children[1]
//           );
//           isServer = true;
//           break;
//           // }
//         }
//       }
//       // if (isServer) break;
//     }
//     console.log(isServer, "isServer", clickedObjectServer.name);
//     if (isServer) {
//       console.log(
//         "Clicked on a server object server dgvdshdiohj:",
//         clickedObjectServer.name
//       );
//       this.serverinfo(clickedObjectServer);
//     } else {
//       this.hideAllInfo();
//     }
//   }

//   async serverinfo(serverObject) {
//     const serverInfo = document.getElementById("serverInfo");
//     if (!serverInfo) {
//       console.error("serverInfo element not found");
//       return;
//     }

//     let current = serverObject;
//     while (current && !current.name?.startsWith("Server_Rack")) {
//       current = current.parent;
//     }

//     const rackName = current?.name;
//     console.log("Resolved rack name:", rackName);

//     if (!rackName) {
//       console.error("No valid rack name found from clicked object.");
//       return;
//     }

//     const apiUrl = `http://103.204.95.218:6969/api/v1/ems/rack/${rackName}`;
//     console.log("Fetching from API:", apiUrl);

//     try {
//       const response = await fetch(apiUrl);
//       const jsonData = await response.json();
//       const data = jsonData?.data;

//       if (!data) {
//         console.warn("No data found for rack:", rackName);
//         serverInfo.innerHTML = `<p>No data found for ${rackName}</p>`;
//         serverInfo.style.display = "block";
//         return;
//       }

//       serverInfo.innerHTML = `
//         <h3>${data.rack_name || "N/A"} Info</h3>
//         <p><strong>Row:</strong> ${data.row_name}</p>
//         <p><strong>Servers:</strong>12 servers</p>
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

//   hideServerInfo() {
//     const serverInfo = document.getElementById("serverInfo");
//     if (serverInfo) {
//       serverInfo.style.display = "none";
//     }
//   }

//   hideAllInfo() {
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

  // onTapserver(event) {
  //   if (!this.objectServer || !this.objectServer.children) {
  //     console.error("3D model not loaded yet or failed to load");
  //     return;
  //   }

  //   let avatar = this.getMyAvatar();
  //   let raycaster = avatar.setRaycastFrom2D(event.xy);

  //   const intersects = raycaster.intersectObjects(
  //     this.objectServer.children,
  //     true
  //   );

  //   if (intersects.length === 0) {
  //     this.hideAllInfo();
  //     return;
  //   }

  //   let clickedObjectServer = intersects[0].object;

  //   // Check if the clicked object is in the allowed range
  //   let isAllowedObject = false;
  //   let parentObject = null;

  //   // Find the parent object in the allowed range (3-149, skip 4-18)
  //   let current = clickedObjectServer;
  //   while (current && current.parent !== this.objectServer) {
  //     current = current.parent;
  //   }

  //   if (current && current.parent === this.objectServer) {
  //     const index = this.objectServer.children.indexOf(current);
  //     if (index >= 3 && index <= 149 && !(index >= 4 && index <= 18)) {
  //       isAllowedObject = true;
  //       parentObject = current;
  //     }
  //   }

  //   if (!isAllowedObject) {
  //     this.hideAllInfo();
  //     return;
  //   }

  //   if (this.lastClickedObjectServer === clickedObjectServer) {
  //     this.hideAllInfo();
  //     this.lastClickedObjectServer = null;
  //     return;
  //   }

  //   this.lastClickedObjectServer = clickedObjectServer;

  //   let isRack = false;
  //   let isServer = false;

  //   // Check if it's a rack (child 12 of any allowed parent)
  //   if (
  //     parentObject &&
  //     parentObject.children &&
  //     parentObject.children[12] === clickedObjectServer
  //   ) {
  //     isRack = true;
  //   }

  //   if (isRack) {
  //     this.serverinfo(clickedObjectServer);
  //     return;
  //   }

  //   // Check if it's a server (child 1 of any child 0-11 of allowed parent)
  //   if (parentObject) {
  //     for (let j = 0; j <= 11; j++) {
  //       if (
  //         parentObject.children[j] &&
  //         parentObject.children[j].children[0] &&
  //         parentObject.children[j].children[1] === clickedObjectServer
  //       ) {
  //         isServer = true;
  //         break;
  //       }
  //     }
  //   }

  //   console.log(isServer, "isServer", clickedObjectServer.name);
  //   if (isServer) {
  //     console.log(
  //       "Clicked on a server object server:",
  //       clickedObjectServer.name
  //     );
  //     this.serverinfo(clickedObjectServer);
  //   } else {
  //     this.hideAllInfo();
  //   }
  // }

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
    console.log("Clicked object:", clickedObjectServer.name);

    // Check if the clicked object is in the allowed range
    let isAllowedObject = false;
    let parentObject = null;

    // Find the parent object in the allowed range (3-149, skip 4-18)
    let current = clickedObjectServer;
    while (current && current.parent !== this.objectServer) {
      current = current.parent;
    }

    if (current && current.parent === this.objectServer) {
      const index = this.objectServer.children.indexOf(current);
      if (index >= 3 && index <= 149 && !(index >= 4 && index <= 18)) {
        isAllowedObject = true;
        parentObject = current;
        console.log("Valid parent object found:", parentObject.name);
      }
    }

    if (!isAllowedObject) {
      this.hideAllInfo();
      return;
    }

    if (this.lastClickedObjectServer === clickedObjectServer) {
      this.hideAllInfo();
      this.lastClickedObjectServer = null;
      return;
    }

    this.lastClickedObjectServer = clickedObjectServer;

    let isRack = false;
    let isServer = false;

    // Check if it's a rack (child 12 of any allowed parent)
    if (
      parentObject &&
      parentObject.children &&
      parentObject.children[12] === clickedObjectServer
    ) {
      isRack = true;
      console.log("Rack detected:", clickedObjectServer.name);
    }

    if (isRack) {
      this.serverinfo(clickedObjectServer);
      return;
    }

    // Improved server detection
    if (parentObject) {
      console.log("Checking for server in parent:", parentObject.name);
      for (let j = 0; j <= 11; j++) {
        if (parentObject.children[j] && parentObject.children[j].children) {
          // Check both possible server parts (children[0] and children[1])
          for (let k = 0; k <= 1; k++) {
            if (parentObject.children[j].children[k] === clickedObjectServer) {
              isServer = true;
              console.log(
                "Server detected at position:",
                j,
                k,
                clickedObjectServer.name
              );
              break;
            }
          }
          if (isServer) break;
        }
      }
    }

    console.log(
      "Final check - isServer:",
      isServer,
      "for object:",
      clickedObjectServer.name
    );
    if (isServer) {
      console.log("Clicked on a server object:", clickedObjectServer.name);
      this.serverinfo(clickedObjectServer);
    } else {
      console.log("Clicked object is neither rack nor server");
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

    // const apiUrl = `http://103.204.95.218:6969/api/v1/ems/rack/${rackName}`;
    //ems-backend-ui21.onrender.com/api/v1/ems/rack
    const apiUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/rack/${rackName}`;
    https: console.log("Fetching from API:", apiUrl);

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
