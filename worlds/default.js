// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

export function init(Constants) {
  Constants.AvatarNames = ["newwhite"];

  /* Alternatively, you can specify a card spec for an avatar,
       instead of a string for the partical file name, to create your own avatar.
       You can add behaviorModules here. Also, if the system detects a behavior module
       named AvatarEventHandler, that is automatically installed to the avatar.
        {
            type: "3d",
            modelType: "glb",
            name: "rabbit",
            dataLocation: "./assets/avatars/newwhite.zip",
            dataRotation: [0, Math.PI, 0],
            dataScale: [0.3, 0.3, 0.3],
        }
    */

  Constants.UserBehaviorDirectory = "behaviors/default";
  Constants.UserBehaviorModules = [
    "lights.js",
    "names.js",
    // "server.js",
    "highlight.js",
    // "hinge.js",
    // "guiFunctionality.js",
    "serverGraph.js",
  ];

  Constants.DefaultCards = [
    {
      card: {
        name: "world model",
        layers: ["walk"],
        type: "3d",
        singleSided: true,
        shadow: true,
        translation: [0, -1.7, 0],
        placeholder: true,
        placeholderSize: [400, 0.1, 400],
        placeholderColor: 0xe0e0e0,
        placeholderOffset: [0, 0, 0],
      },
    },
    // {
    //   card: {
    //     name: "light",
    //     layers: ["light"],
    //     type: "lighting",
    //     behaviorModules: ["Light"],
    //     dataLocation:
    //       "3OF2-s4U1ZOJduGATmLEIXo1iTkQHd5ZBknKgL5SvqpQJzs7Pzx1YGApJiMqPGE6PGEsPSA-Oio7YSYgYDpgCCsZLTYjBjwOJB4sDRcrfAg3Ljk2OBoEGBYWfWAmIGEsPSA-Oio7YSImLD0gOSo9PCpgPwB9AAIIISx8YiYneScqKyQaIisNLHkaGT8YKg56JQwQfHstPiNiGQ49e2ArLjsuYCMBPgMiCQt3OQskGhcleSp9HQIIfXseHgo7EAo9CB48FRwpegsCLH4OIwY",
    //     fileName: "/abandoned_parking_4k.jpg",
    //     dataType: "jpg",
    //     toneMappingExposure: 1.2,
    //   },
    // },
    {
      card: {
        name: "world model",
        layers: ["walk", "pointer"],
        singleSided: true,
        shadow: true,
        translation: [0, -1.5, 0],
        rotation: [0, 0, 0],
        type: "3d",
        modelType: "glb",
        dataScale: [
          2.14248427342754574, 2.14248427342754574, 2.14248427342754574,
        ],
        name: "/Server_Room.v1 (3).glb",
        // temp1

        // dataLocation: "3AYk8iYB3-EC2aa8tXyo8KwQ6i92t1PlzHBBv4LJRAPIKTU1MTJ7bm4nKC0kMm80Mm8iMy4wNCQ1bygubjRuOxQ1NhEOOwc0DhJwCigmDBsodHJ4OQcFBnlxc24oLm8iMy4wNCQ1bywoIjMuNyQzMiRvLS4iIC0lJDclJCcgNC01bg8kCQIsKCI2cw4SKyswCy8xBGwzJxsgLQsJeRUGLggkLzgOBTsDbAckC3FuJSA1IG4vLBU5Bjk3LRN3eCx0FwdycStyOwcVchgCdTMHdTMLGA94CRgmbBIuDTs2",
        // temp
        dataLocation: "../assets/Server_Room_New (14).glb",
        behaviorModules: ["Highlight", "ServerInfo"],
        //   "3QyuIgmSRrUTOpWn4W6J8WA2kOQvqjh4yCTUiw_AcgZ0OSUlISJrfn43OD00In8kIn8yIz4gJDQlfzg-fiR-KwQlJgEeKxckHgJgGjg2HAs4ZGJoKRcVFmlhY344Pn8yIz4gJDQlfzw4MiM-JzQjIjR_PT4yMD01NCc1NDcwJD0lfmAQKRMCGSgEMGAfOQE_OiU8NWFhaAcbHjg7YD46IR8bNztoARYOOGQdKxB-NTAlMH4-A2kSIiErMgQyZgEANQAmBig7MAMhaAc0BhskZjoiKDQnMDRlAjgeHStp",

        // behaviorModules: [
        //   "GuiFunctionality",
        //   "ServerInfo",
        //   "TialObject",
        //   "Highlight",
        // ],
        // "ServerInfo",
        // "TialObject"
        // Gui
        // Highlight
        fullBright: false,
        placeholder: true,
        placeholderSize: [400, 0.1, 400],
        placeholderColor: 0x808080,
        placeholderOffset: [0, 0, 0],
      },
    },

    {
      card: {
        name: "light",
        layers: ["light"],
        type: "lighting",
        behaviorModules: ["Light"],
        fileName: "/sky/hamburg_canal_4k.exr",
        dataLocation: "./assets/sky/modern_buildings_4k.exr",
        dataType: "exr",
        toneMappingExposure: 0.7,
        loadSynchronously: true,
      },
    },

    {
      card: {
        name: "entrance",
        type: "object",
        translation: [
          0.9523000197314464, -0.14595834442125688, 8.863921777540416,
        ],
        rotation: [0, 0.3440628632260013, 0, 0.9389466151750726],
        spawn: "default",
        behaviorModules: ["Names"],
      },
    },
  ];
}
