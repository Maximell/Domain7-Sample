
export const componentTypes = {
  "Drivetrain": {
    battery: "Battery",
    cable: "Cable",
    chain: "Chain",
    cassette: "Cassette",
    chainrings: "Chain Ring(s)",
    crank: "Cranks",
    frontDerailleur: "Front Derailleur",
    rearDerailleur: "Rear Derailleur",
    frontShifter: "Front Shifter",
    rearShifter: "Rear Shifter"
  },
  "Suspension": {
    fork: "Fork",
    shock: "Shock",
    dropper: "Dropper",
    pivots: "Suspension Pivots"
  },
  "Bearings": {
    headset: "Headset",
    bottomBracket: "Bottom Bracket",
    pivots: "Suspension Pivots"
  },
  "Wheels/Tires": {
    wheels: "Wheels",
    hubs: "Hubs",
    tires: "Tires",
    tube: "Tube",
    sealant: "Sealant",
    axle: "Axle",
    rims: "Rims",
  },
  "Brakes": {
    levers: "Levers",
    calipers: "Calipers",
    rotors: "Rotors",
    pads: "Pads"
  },
  "Contact Points": {
    handlebar: "Handlebar",
    stem: "Stem",
    seatpost: "Seatpost",
    saddle: "Saddle",
    pedals: "Pedals",
    barTape: "Bar Tape",
    grips: "Grips",
    cleats: "Cleats"
  },
  "Accessories": {
    bikeComputer: "Bike Computer",
    heartRateMonitor: "Heart Rate Monitor",
    powerMeter: "Power Meter",
    headlight: "Headlight",
    rearLight: "Rear Light"
  },
  "Other": {
    other: "Other"
  }
}

export const componentMaintenanceSuggestions = {
  "Drivetrain": {
    [componentTypes["Drivetrain"].battery]: [
      {
        name: "Charge eTap",
        serviceTime: 50 * 3600
      },
      {
        name: "Charge di2",
        serviceTime: 75 * 3600
      }
    ],
    [componentTypes["Drivetrain"].cable]: [
      {
        name: "Replace Derailleur Cable",
        serviceDistance: 4500 * 1000,
        serviceTime: 150 * 3600
      },
      {
        name: "Replace Brake Cable",
        serviceDistance: 4500 * 1000,
        serviceTime: 150 * 3600
      }
    ],
    [componentTypes["Drivetrain"].chain]: [
      {
        name: "Replace Chain",
        serviceDistance: 3000 * 1000,
        serviceTime: 100 * 3600
      },
      {
        name: "Lubricate Chain",
        serviceDistance: 200 * 1000,
        serviceTime: 6 * 3600
      }
    ],
    [componentTypes["Drivetrain"].cassette]: [
      {
        name: "Replace Cassette",
        serviceDistance: 9000 * 1000,
        serviceTime: 300 * 3600
      }
    ],
    [componentTypes["Drivetrain"].chainrings]: [
      {
        name: "Replace Chainring(s)",
        serviceDistance: 9000 * 1000,
        serviceTime: 300 * 3600
      }
    ],
    [componentTypes["Drivetrain"].crank]: [],
    [componentTypes["Drivetrain"].frontDerailleur]: [],
    [componentTypes["Drivetrain"].rearDerailleur]: [],
    [componentTypes["Drivetrain"].frontShifter]: [],
    [componentTypes["Drivetrain"].rearShifter]: []
  },
  "Suspension": {
    [componentTypes["Suspension"].fork]: [
      {
        name: "Fox Lower Leg Service",
        serviceTime: 30 * 3600
      },
      {
        name: "Fox Damper Service",
        serviceTime: 100 * 3600
      },
      {
        name: "RockShox Lower Leg Service",
        serviceTime: 50 * 3600
      },
      {
        name: "RockShox Damper Service",
        serviceTime: 100 * 3600
      }
    ],
    [componentTypes["Suspension"].shock]: [
      {
        name: "Fox Full Service",
        serviceTime: 100 * 3600
      },
      {
        name: "RockShox Air Can Service",
        serviceTime: 50 * 3600
      },
      {
        name: "RockShox Damper Service",
        serviceTime: 100 * 3600
      }
    ],
    [componentTypes["Suspension"].dropper]: [
      {
        name: "RockShox Reverb Full Service",
        serviceTime: 200 * 3600
      },
      {
        name: "Fox Transfer Full Service",
        serviceTime: 125 * 3600
      }
    ],
    [componentTypes["Suspension"].pivots]: [
      {
        name: "Check Pivot Torque",
        serviceTime: 20 * 3600
      },
      {
        name: "Grease and Reassemble",
        serviceTime: 100 * 3600
      }
    ]
  },
  "Bearings": {
    [componentTypes["Bearings"].headset]: [
      {
        name: "Inspect Headset",
        serviceTime: 200 * 3600
      }
    ],
    [componentTypes["Bearings"].bottomBracket]: [
      {
        name: "Inspect Bottom Bracket",
        serviceTime: 200 * 3600
      }
    ],
    [componentTypes["Bearings"].pivots]: [
      {
        name: "Check Pivot Torque",
        serviceTime: 20 * 3600
      },
      {
        name: "Grease and Reassemble",
        serviceTime: 100 * 3600
      }
    ]
  },
  "Wheels/Tires": {
    [componentTypes["Wheels/Tires"].wheels]: [
      {
        name: "Service Cup and Cone Hubs",
        serviceTime: 200 * 3600
      },
      {
        name: "Service Cartridge Bearing Hubs",
        serviceTime: 400 * 3600
      }
    ],
    [componentTypes["Wheels/Tires"].hubs]: [
      {
        name: "Service Cup and Cone Hubs",
        serviceTime: 200 * 3600
      },
      {
        name: "Service Cartridge Bearing Hubs",
        serviceTime: 400 * 3600
      }
    ],
    [componentTypes["Wheels/Tires"].tires]: [
      {
        name: "Replace Road Racing Tires",
        serviceDistance: 3000 * 1000,
        serviceTime: 100 * 3600
      },
      {
        name: "Replace Road Training Tires",
        serviceDistance: 6000 * 1000,
        serviceTime: 200 * 3600
      },
      {
        name: "Replace Commuting / Touring Tires",
        serviceDistance: 9000 * 1000,
        serviceTime: 300 * 3600
      },
    ],
    [componentTypes["Wheels/Tires"].tube]: [],
    [componentTypes["Wheels/Tires"].sealant]: [
      {
        name: "Replace Sealant",
        serviceTime: 200 * 3600
      }
    ],
    [componentTypes["Wheels/Tires"].axle]: [],
    [componentTypes["Wheels/Tires"].rims]: []
  },
  "Brakes": {
    [componentTypes["Brakes"].levers]: [],
    [componentTypes["Brakes"].calipers]: [],
    [componentTypes["Brakes"].rotors]: [],
    [componentTypes["Brakes"].pads]: []
  },
  "Contact Points": {
    [componentTypes["Contact Points"].handlebar]: [],
    [componentTypes["Contact Points"].stem]: [],
    [componentTypes["Contact Points"].seatpost]: [],
    [componentTypes["Contact Points"].saddle]: [],
    [componentTypes["Contact Points"].pedals]: [],
    [componentTypes["Contact Points"].barTape]: [],
    [componentTypes["Contact Points"].grips]: [],
    [componentTypes["Contact Points"].cleats]: []
  },
  "Accessories": {
    [componentTypes["Accessories"].bikeComputer]: [],
    [componentTypes["Accessories"].heartRateMonitor]: [],
    [componentTypes["Accessories"].powerMeter]: [],
    [componentTypes["Accessories"].headlight]: [],
    [componentTypes["Accessories"].rearLight]: []
  },
  "Other": {
    [componentTypes["Other"].other]: []
  }
}

export function getIconForComponentType(componentType) {
  switch (componentType) {
    case componentTypes["Drivetrain"].chain:
      return require("@assets/images/chain-icon.png");
    case componentTypes["Drivetrain"].cassette:
      return require("@assets/images/cassette-icon.png");
    case componentTypes["Drivetrain"].chainrings:
      return require("@assets/images/chainring-icon.png");
    case componentTypes["Drivetrain"].crank:
      return require("@assets/images/cranks-icon.png");
    case componentTypes["Drivetrain"].frontDerailleur:
      return require("@assets/images/frontderailleur-icon.png");
    case componentTypes["Drivetrain"].rearDerailleur:
      return require("@assets/images/rearderailleur-icon.png");
    case componentTypes["Drivetrain"].frontShifter:
    case componentTypes["Drivetrain"].rearShifter:
      return require("@assets/images/shifter-icon.png");
    case componentTypes["Suspension"].fork:
      return require("@assets/images/fork-icon.png");
    case componentTypes["Suspension"].shock:
      return require("@assets/images/shock-icon.png");
    case componentTypes["Suspension"].dropper:
      return require("@assets/images/seatpost-icon.png");
    case componentTypes["Suspension"].pivots:
    case componentTypes["Bearings"].pivots:
      return require("@assets/images/pivotbearing-icon.png");
    case componentTypes["Bearings"].headset:
      return require("@assets/images/headset-icon.png");
    case componentTypes["Bearings"].bottomBracket:
      return require("@assets/images/bottombracket-icon.png");
    case componentTypes["Wheels/Tires"].wheels:
    case componentTypes["Wheels/Tires"].rims:
      return require("@assets/images/wheel-icon.png");
    case componentTypes["Wheels/Tires"].hubs:
      return require("@assets/images/hub-icon.png");
    case componentTypes["Wheels/Tires"].tires:
      return require("@assets/images/tire-icon.png");
    case componentTypes["Wheels/Tires"].tube:
      return require("@assets/images/tube-icon.png");
    case componentTypes["Wheels/Tires"].sealant:
      return require("@assets/images/sealant-icon.png");
    case componentTypes["Wheels/Tires"].axle:
      return require("@assets/images/axle-icon.png");
    case componentTypes["Brakes"].levers:
      return require("@assets/images/lever-icon.png");
    case componentTypes["Brakes"].calipers:
      return require("@assets/images/caliper-icon.png");
    case componentTypes["Brakes"].rotors:
      return require("@assets/images/rotor-icon.png");
    case componentTypes["Brakes"].pads:
      return require("@assets/images/pads-icon.png");
    case componentTypes["Drivetrain"].battery:
    case componentTypes["Drivetrain"].cable:
    case componentTypes["Contact Points"].handlebar:
    case componentTypes["Contact Points"].stem:
    case componentTypes["Contact Points"].seatpost:
    case componentTypes["Contact Points"].saddle:
    case componentTypes["Contact Points"].pedals:
    case componentTypes["Contact Points"].barTape:
    case componentTypes["Contact Points"].grips:
    case componentTypes["Contact Points"].cleats:
    case componentTypes["Accessories"].bikeComputer:
    case componentTypes["Accessories"].heartRateMonitor:
    case componentTypes["Accessories"].powerMeter:
      return require("@assets/images/other-icon.png");
    case componentTypes["Accessories"].headlight:
    case componentTypes["Accessories"].rearLight:
      return require("@assets/images/light-icon.png");
    case componentTypes["Other"].other:
    default:
      return require("@assets/images/other-icon.png");
  }
}
