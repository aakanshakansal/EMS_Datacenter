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
    "highlight.js",
    "serverGraph.js",
    "hinge.js",
    "door.js",
    "graph.js",
  ];

  const avatarModels = [
    "3kDNEN2jKhiPYcYAfItpXCcaahDmYM54K-kP6mKb_x8AAx8fGxhRREQNAgcOGEUeGEUIGQQaHg4fRQIERB5ELA89CRIHIhgqADoIKTMPWCwTCh0SHD4gPDIyWUQCBEUIGQQaHg4fRQYCCBkEHQ4ZGA5EEgMHOzsPIC46GCoaMxsfOjwhBCIuWxM8XzwZHjpfND8JIw4cBQ8oXi8lOkQPCh8KRD0aDSQSEjkvICQ5BQM6Xi1GHhk9OglGOAcDBw0CHAEYD1wkKR0PITNGDBg",
    "3qPM9OnJ8B8G-bx-DZtT_uk55iJ-4seqH4D_N7XJcmxMGQUFAQJLXl4XGB0UAl8EAl8SAx4ABBQFXxgeXgReNhUnEwgdOAIwGiASMykVQjYJEAcIBiQ6JigoQ14YHl8SAx4ABBQFXxwYEgMeBxQDAhReCBkdISEVOjQgAjAAKQEFICY7Hjg0QQkmRSYDBCBFLiUTORQGHxUyRDU_IF4VEAUQXjwFBSNHOj4rAgIbNz8COSEnFTUFCD4gJD4gKTIkRQZEGi42CRQAKDk8MAY",
    "3pOqrArMCIRUilNQ5kh5jDQpDI9rMSWBMf3S8zPNUX4gGAQEAANKX18WGRwVA14FA14TAh8BBRUEXhkfXwVfNxQmEgkcOQMxGyETMigUQzcIEQYJByU7JykpQl8ZH14TAh8BBRUEXh0ZEwIfBhUCAxVfCRgcICAUOzUhAzEBKAAEISc6Hzk1QAgnRCcCBSFELyQSOBUHHhQzRTQ-IV8UEQQRXxEIHEcpEkc-IDIKSDRIFgo7RwdJNUM_Ej4-FyhGChwfPD1DM0QIMSAcNjE",
    "3YrnwoVTORoxhAZDdVvJXzOO62FQKMuP7C2JaVRcRhXMMS0tKSpjdnY_MDU8KncsKnc6KzYoLDwtdzA2dix2Hj0POyA1ECoYMgg6GwE9ah4hOC8gLgwSDgAAa3YwNnc6KzYoLDwtdzQwOis2LzwrKjx2IDE1CQk9EhwIKhgoASktCA4TNhAcaSEObQ4rLAhtBg07ETwuNz0abB0XCHY9OC04dhg4FmA1Dho2KBNhGGh0YSg1ETcqDhoDNy07OGgJODMbHD4JHTNoMhFoPDI",
    "3B45okYnR2Z096wkAU7ACqQg7iGeh5lcva8FNB-RZ-sgKjY2MjF4bW0kKy4nMWw3MWwhMC0zNyc2bCstbTdtBSYUIDsuCzEDKRMhABomcQU6IzQ7NRcJFRsbcG0rLWwhMC0zNyc2bC8rITAtNCcwMSdtOyouEhImCQcTMQMzGjI2ExUILQsHcjoVdhUwNxN2HRYgCic1LCYBdwYME20mIzYjbRc1BHcpdQcrIDsWBDs6ehY2Eht2Fxd6cBAxKCUzNnMQHRgUCggKcAUgHQ8",
    "3qPM9OnJ8B8G-bx-DZtT_uk55iJ-4seqH4D_N7XJcmxMGQUFAQJLXl4XGB0UAl8EAl8SAx4ABBQFXxgeXgReNhUnEwgdOAIwGiASMykVQjYJEAcIBiQ6JigoQ14YHl8SAx4ABBQFXxwYEgMeBxQDAhReCBkdISEVOjQgAjAAKQEFICY7Hjg0QQkmRSYDBCBFLiUTORQGHxUyRDU_IF4VEAUQXjwFBSNHOj4rAgIbNz8COSEnFTUFCD4gJD4gKTIkRQZEGi42CRQAKDk8MAY",
  ];

  Constants.AvatarNames = avatarModels.map((dataLocation, i) => ({
    type: "3d",
    name: `Visitor ${i + 1}`,
    modelType: "glb",
    avatarType: "wonderland",
    dataLocation,
    dataRotation: [0, Math.PI, 0],
    dataScale: [0.3, 0.3, 0.3],
  }));

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
    {
      card: {
        translation: [0, -1.4206813794726825, 0],
        rotation: [0, 0, 0, 1],
        layers: ["walk", "pointer"],
        behaviorModules: ["Highlight", "ServerInfo", "Names", "Cabinet"],
        name: "/Server_Room_01_05_V5.glb",
        // dataLocation: "../assets/Server_Room_W_OGlass_hinge.glb",
        dataLocation: "../assets/Server_Room_01_05_V5.glb",
        dataScale: [2.1424842734275455, 2.1424842734275455, 2.1424842734275455],
        fullBright: false,
        modelType: "glb",
        placeholder: true,
        placeholderColor: 8421504,
        placeholderOffset: [0, 0, 0],
        placeholderSize: [400, 0.1, 400],
        shadow: true,
        singleSided: true,
        type: "3d",
      },
    },
    // {
    //   card: {
    //     name: "world model",
    //     layers: ["walk", "pointer"],
    //     singleSided: true,
    //     shadow: true,
    //     translation: [0, -1.5, 0],
    //     rotation: [0, 0, 0],
    //     type: "3d",
    //     modelType: "glb",
    //     dataScale: [
    //       2.14248427342754574, 2.14248427342754574, 2.14248427342754574,
    //     ],
    //     name: "/Server_Room.v1 (3).glb",
    //     dataLocation: "../assets/Server_Room_W_OGlass_hinge.glb",
    //     // dataLocation: "../assets/Server_Room_W_OGlass (2)29_04.glb",
    //     behaviorModules: ["Highlight", "ServerInfo", "Names"],
    //     fullBright: false,
    //     placeholder: true,
    //     placeholderSize: [400, 0.1, 400],

    //     placeholderColor: 0x808080,
    //     placeholderOffset: [0, 0, 0],
    //   },
    // },
    // {
    //   card: {
    //     name: "line graphs background",
    //     translation: [
    //       8.199494055247747, 0.8662857490129259, -11.095027673536274,
    //     ],
    //     // scale: [4, 4, 4],
    //     rotation: [0, 0.010010787000894897, 0, 0.9999498908163462],
    //     scale: [2, 2, 2],
    //     className: "TextFieldActor",
    //     type: "text",
    //     layers: ["pointer"],
    //     color: 0xffffff,
    //     backgroundColor: 0x202020,
    //     frameColor: 0x202020,
    //     width: 1.1,
    //     height: 1.2,
    //     depth: 0.05,
    //     margins: { bottom: 20, left: 20, right: 20, top: 20 },
    //     runs: [{ text: "CPU\n\n\n\nMEM\n\n\n\nNET" }],
    //     textScale: 0.002,
    //   },
    //   id: "linegraphs",
    // },
    // {
    //   card: {
    //     name: "yellow line graph",
    //     translation: [
    //       8.199494055247747, 0.8662857490129259, -11.095027673536274,
    //     ],
    //     height: 0.2,
    //     color: 0xffff00,
    //     generateValues: { min: 0, max: 100, tick: 100 },
    //     length: 20,
    //     behaviorModules: ["Values", "LineGraph"],
    //     parent: "linegraphs",
    //   },
    // },
    // {
    //   card: {
    //     name: "cyan line graph",
    //     translation: [0, -0.1, 0.05],
    //     height: 0.2,
    //     color: 0x00ffff,
    //     generateValues: { min: 0, max: 100, tick: 100 },
    //     length: 20,
    //     behaviorModules: ["Values", "LineGraph"],
    //     parent: "linegraphs",
    //   },
    // },
    // {
    //   card: {
    //     name: "magenta line graph",
    //     translation: [0, 0.3, 0.05],
    //     height: 0.2,
    //     color: 0xff00ff,
    //     generateValues: { min: 0, max: 100, tick: 100 },
    //     length: 20,
    //     behaviorModules: ["Values", "LineGraph"],
    //     parent: "linegraphs",
    //   },
    // },

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
        translation: [
          8.199494055247747, 0.8662857490129259, -11.095027673536274,
        ],
        scale: [4, 4, 4],
        rotation: [0, 0.010010787000894897, 0, 0.9999498908163462],
        layers: ["walk", "pointer"],
        singleSided: true,
        shadow: true,
        translation: [0, -1.5, 0],
        rotation: [0, 0, 0],
        type: "3d",
        modelType: "glb",
        name: "/Server_Room.v1 (3).glb",
        dataLocation: "../assets/Door.glb",
        fullBright: false,
        placeholder: true,
        placeholderSize: [400, 0.1, 400],

        placeholderColor: 0x808080,
        placeholderOffset: [0, 0, 0],
      },
    },

    {
      card: {
        name: "entrance",
        type: "object",
        translation: [
          8.122586733025857, -0.19401244752010927, 15.885658755018573,
        ],
        rotation: [0, -0.1510499317349649, 0, 0.988526134263967],
        spawn: "default",
        behaviorModules: ["Names"],
      },
    },
  ];
}
