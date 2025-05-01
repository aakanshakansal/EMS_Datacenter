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

    console.log("Clicked object: server pawn ", clickedObjectServer.name);

    let isRack = false;
    let isServer = false;

    for (let i = 3; i <= 148; i++) {
      if (i >= 4 && i <= 17) continue;

      const child = this.objectServer.children[i];
      if (!child || !child.children) continue;

      if (clickedObjectServer === child.children[12]) {
        isRack = true;
        break;
      }
    }

    if (isRack) {
      this.rackinfo(clickedObjectServer);
      this.hideServerInfo();
      return;
    }

    for (let i = 3; i <= 148; i++) {
      if (i >= 4 && i <= 17) continue;

      const child = this.objectServer.children[i];
      if (!child || !child.children) continue;

      for (let j = 0; j <= 11; j++) {
        if (!child.children[j] || !child.children[j].children) continue;

        for (let k = 0; k <= 1; k++) {
          if (
            child.children[j].children[k] &&
            clickedObjectServer === child.children[j].children[k]
          ) {
            isServer = true;
            break;
          }
        }
        if (isServer) break;
      }
      if (isServer) break;
    }

    if (isServer) {
      console.log("jenkrkdmk", clickedObjectServer);
      this.hideRackInfo();
      this.serverinfo(clickedObjectServer);
    } else {
      this.hideAllInfo();
    }
  }

  async rackinfo(serverObject) {
    const rackInfo = document.getElementById("rackInfo");
    if (!rackInfo) {
      console.error("rackInfo element not found");
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

    const apiUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/rack/${rackName}`;

    https: console.log("Fetching from API:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      const data = jsonData?.data;

      if (!data) {
        console.warn("No data found for rack:", rackName);
        rackInfo.innerHTML = `<p>No data found for ${rackName}</p>`;
        rackInfo.style.display = "block";
        return;
      }

      rackInfo.innerHTML = `
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

      rackInfo.style.left = "10px";
      rackInfo.style.top = "10px";
      rackInfo.style.display = "block";
    } catch (error) {
      console.error("Failed to fetch server rack data:", error);
      rackInfo.innerHTML = `<p>Error fetching server info.</p>`;
      rackInfo.style.display = "block";
    }
  }

  // async serverinfo1(serverObject) {
  //   const serverInfo1 = document.getElementById("serverInfo1");
  //   if (!serverInfo1) {
  //     console.error("serverInfo1 element not found");
  //     return;
  //   }

  //   let current = serverObject;
  //   while (current && !current.name?.startsWith("server")) {
  //     current = current.parent;
  //   }

  //   const serverName = current?.name;
  //   console.log("Resolved rack name:", serverName);

  //   if (!serverName) {
  //     console.error("No valid rack name found from clicked object.");
  //     return;
  //   }

  //   // const apiUrl = `http://103.204.95.218:6969/api/v1/ems/rack/${serverName}`;
  //   //ems-backend-ui21.onrender.com/api/v1/ems/rack/Server_Rack001
  //   console.log("serverNamesssssssssss", serverName);
  //   const apiUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/server/${serverName}`;

  //   console.log("Fetching from API:", apiUrl);

  //   try {
  //     const response = await fetch(apiUrl);
  //     const jsonData = await response.json();
  //     const data = jsonData?.data;

  //     if (!data) {
  //       console.warn("No data found for server:", serverName);
  //       serverInfo1.innerHTML = `<p>No data found for ${serverName}</p>`;
  //       serverInfo1.style.display = "block";
  //       return;
  //     }

  //     serverInfo1.innerHTML = `
  //       <h3>${data.rack_name || "N/A"} Info</h3>
  //       <p><strong>Row:</strong> ${data.row_name}</p>
  //       <p><strong>Servers:</strong>12 servers</p>
  //       <p><strong>IT Power:</strong> ${data.it_power} ${data.it_power_unit}</p>
  //       <p><strong>PUE:</strong> ${data.pue} ${data.pue_unit}</p>
  //       <p><strong>HVAC Power:</strong> ${data.hvac_power} ${
  //       data.hvac_power_unit
  //     }</p>
  //       <p><strong>Total UPS Power:</strong> ${data.total_ups_power} kW</p>
  //       <p><strong>UPS Time:</strong> ${data.total_ups_time} hrs</p>
  //       <p><strong>Server Utilization:</strong> ${data.server_utilization}%</p>
  //       <p><strong>Temperature Modeling:</strong> ${
  //         data.temperature_modeling
  //       }°C</p>
  //       <p><strong>Network Traffic Usage:</strong> ${
  //         data.network_traffic_usage
  //       }%</p>
  //       <p><strong>CFD:</strong> ${data.cfd}</p>

  //       <p><strong>Last Updated:</strong> ${new Date(
  //         data.createdAt
  //       ).toLocaleString()}</p>
  //       <hr>
  //     `;

  //     serverInfo1.style.left = "10px";
  //     serverInfo1.style.top = "10px";
  //     serverInfo1.style.display = "block";
  //   } catch (error) {
  //     console.error("Failed to fetch server rack data:", error);
  //     serverInfo1.innerHTML = `<p>Error fetching server info.</p>`;
  //     serverInfo1.style.display = "block";
  //   }
  // }

  async serverinfo(serverObject) {
    const serverInfo = document.getElementById("serverInfo");
    if (!serverInfo) {
      console.error("serverInfo element not found");
      return;
    }

    let current = serverObject;
    while (current && !current.name?.startsWith("server")) {
      current = current.parent;
    }

    let rawName = current?.name;
    console.log("Resolved rack name:", rawName);

    if (!rawName) {
      console.error("No valid rack name found from clicked object.");
      return;
    }

    // Extract number from names like "server001_2" or "server1584_2"
    const match = rawName.match(/server(\d+)_\d+/);
    if (!match) {
      console.error("Invalid server name format:", rawName);
      return;
    }

    const number = parseInt(match[1], 10); // removes leading zeros
    const serverName = `server_${number}`;
    console.log("Formatted server name for API:", serverName);

    const apiUrl = `https://ems-backend-ui21.onrender.com/api/v1/ems/server/${serverName}`;
    console.log("Fetching from API:", apiUrl);

    try {
      const response = await fetch(apiUrl);
      const jsonData = await response.json();
      const data = jsonData?.data;

      if (!data) {
        console.warn("No data found for server:", serverName);
        serverInfo.innerHTML = `<p>No data found for ${serverName}</p>`;
        serverInfo.style.display = "block";
        return;
      }

      //   serverInfo.innerHTML = `
      //   <h3>${data.server_name || "N/A"} Info</h3>
      //    <p><strong>Rack:</strong> ${data.rack_name}</p>
      //   <p><strong>Row:</strong> ${data.row_name}</p>
      //   <p><strong>Servers:</strong>12 servers</p>
      //   <p><strong>IT Power:</strong> ${data.it_power} ${data.it_power_unit}</p>
      //   <p><strong>PUE:</strong> ${data.pue} ${data.pue_unit}</p>
      //   <p><strong>HVAC Power:</strong> ${data.hvac_power} ${
      //     data.hvac_power_unit
      //   }</p>
      //   <p><strong>Total UPS Power:</strong> ${data.total_ups_power} kW</p>
      //   <p><strong>UPS Time:</strong> ${data.total_ups_time} hrs</p>
      //   <p><strong>Server Utilization:</strong> ${data.server_utilization}%</p>
      //   <p><strong>Temperature Modeling:</strong> ${
      //     data.temperature_modeling
      //   }°C</p>
      //   <p><strong>Network Traffic Usage:</strong> ${
      //     data.network_traffic_usage
      //   }%</p>
      //   <p><strong>CFD:</strong> ${data.cfd}</p>
      //   <p><strong>Last Updated:</strong> ${new Date(
      //     data.createdAt
      //   ).toLocaleString()}</p>
      //   <hr>
      // `;

      serverInfo.innerHTML = `
  <h3>${data.server_name || "N/A"} Info</h3>
  <p><strong>Rack:</strong> ${data.rack_name}</p>
  <p><strong>Row:</strong> ${data.row_name}</p>
  <p><strong>Power Utilization:</strong> ${data.power_utilization} ${
        data.power_utilization_unit
      }</p>
  <p><strong>CPU Utilization:</strong> ${data.cpu_utilization}%</p>
  <p><strong>Memory Utilization:</strong> ${data.memory_utilization}%</p>
  <p><strong>Network Utilization:</strong> ${data.network_utilization}%</p>
  <p><strong>Server Utilization:</strong> ${data.server_utilization}%</p>
  <p><strong>Temperature Modeling:</strong> ${data.temperature_modeling}°C</p>
  <p><strong>Network Traffic:</strong> ${data.network_traffic}%</p>
  <p><strong>DG Set Power:</strong> ${data.dg_set_power} ${
        data.dg_set_power_unit
      }</p>
  <p><strong>Condition:</strong> ${data.condition}</p>
  <p><strong>Power Status:</strong> ${data.on_off ? "ON" : "OFF"}</p>
  
  <hr>
`;

      serverInfo.style.left = "10px";
      serverInfo.style.top = "10px";
      serverInfo.style.display = "block";
    } catch (error) {
      console.error("Failed to fetch server data:", error);
      serverInfo.innerHTML = `<p>Error fetching server info.</p>`;
      serverInfo.style.display = "block";
    }
  }

  hideRackInfo() {
    const rackInfo = document.getElementById("rackInfo");
    if (rackInfo) {
      rackInfo.style.display = "none";
    }
  }
  hideServerInfo() {
    const serverInfo = document.getElementById("serverInfo");
    if (serverInfo) {
      serverInfo.style.display = "none";
    }
  }

  hideAllInfo() {
    this.hideRackInfo();
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
