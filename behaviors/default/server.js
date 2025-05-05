class ServerInfoPawn {
  setup() {
    this.allowedObjectsServer = new Set();
    this.lastClickedObjectServer = null;
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
    let avatar = this.getMyAvatar();
    let raycaster = avatar.setRaycastFrom2D(event.xy);

    // Perform raycasting but filter out the glass object (child index 14)
    const intersects = raycaster.intersectObjects(
      this.objectServer.children,
      true
    );

    if (intersects.length > 0) {
      let clickedObjectServer = intersects[0].object;

      // Check if the clicked object is "glass"
      if (this.isGlassObject(clickedObjectServer)) {
        console.log("Glass object clicked. Skipping selection.");

        // Remove the glass object and check for objects behind it
        intersects.shift();
        if (intersects.length > 0) {
          clickedObjectServer = intersects[0].object; // Select the next object behind the glass
          console.log("Behind glass, selected object is:", clickedObjectServer);
        } else {
          console.log("No object behind glass.");
          return;
        }
      }

      // Check if the same object is clicked again
      if (this.lastClickedObjectServer === clickedObjectServer) {
        // this.hideAllInfo();
        // this.hideAllDiv();
        this.lastClickedObjectServer = null; // Reset lastClickedObject
        return;
      }

      this.lastClickedObjectServer = clickedObjectServer; // Update last clicked object

      let isRack = false;
      let isServer = false;

      for (let i = 3; i <= 134; i++) {
        if (
          clickedObjectServer === this.objectServer.children[i].children[13]
        ) {
          isRack = true;
          break;
        }
      }

      if (isRack) {
        this.serverinfo(clickedObjectServer);
      } else {
        for (let i = 3; i <= 134; i++) {
          for (let j = 1; j <= 12; j++) {
            if (j === 0) continue;

            for (let k = 0; k <= 1; k++) {
              if (
                clickedObjectServer ===
                this.objectServer.children[i].children[j].children[k]
              ) {
                isServer = true;
                break;
              }
            }
          }
          //   }
        }

        // if (isServer) {
        //   this.serverinfo(clickedObjectServer);
        // } else {
        //   this.hideAllInfo();
        //   this.hideAllDiv();
        // }
      }
    }
  }

  isGlassObject(object) {
    const glassIndex = 0; // Assuming glass is child index 14
    return this.objectServer.children.some(
      (child, index) =>
        index === glassIndex && this.isDescendantOf(child, object)
    );
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

  serverinfo(server) {
    const serverInfo = document.getElementById("serverInfo");
    serverInfo.innerHTML = `
                <h3>${server.name || "N/A"} Info</h3>
                <p>Name: ${server.name || "N/A"}</p>
                ${this.getSubChildrenInfo(server)}
                <hr>
            `;
    serverInfo.style.left = "10px"; // Set position to fixed values for now
    serverInfo.style.top = "10px";
    serverInfo.style.display = "block";
  }

  getSubChildrenInfo(object) {
    // console.log("getSubChildrenInfo od onbj is ",object )
    let info = "";
    object.children.forEach((child, index) => {
      info += `<p>Sub-child Name: ${child.name || "N/A"}</p>`;
    });
    return info;
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
