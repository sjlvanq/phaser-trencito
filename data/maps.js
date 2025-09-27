const w = 14;

const baseStage1 = () => [
    ...Array(4).fill().map(() => Array(w).fill(0)),
    ...Array(1).fill().map(() => Array(w).fill(8)),
    ...Array(1).fill().map(() => Array(w).fill(16)),
    ...Array(1).fill().map(() => Array(w).fill(24)),
    ...Array(3).fill().map(() => Array(w).fill(32)),
    ...Array(1).fill().map(() => Array(w).fill(40)),
    ...Array(1).fill().map(() => Array(w).fill(48)),
    ...Array(3).fill().map(() => Array(w).fill(0)),
    ...Array(1).fill().map(() => Array(w).fill(36)),
    ...Array(1).fill().map(() => Array(w).fill(44)),
    ...Array(4).fill().map(() => Array(w).fill(26)),
];

const tileConfig = {
    tileWidth: 24,
    tileHeight: 24,
    tileSet: "bgtiles",
};

const mapsData = {
    introduction: {
        width: 25,
        height: 7,
        tiles: tileConfig,
        data: [
            Array(25).fill(8*3+2),
            Array(25).fill(8),
            Array(25).fill(16),
            Array(25).fill(48),
            Array(25).fill(44),
            Array(25).fill(0),
            Array(25).fill(8*3+2),
        ]
    },
    staticBackground: {
        width: w,
        height: 23,
        tiles: tileConfig,
        data: [
            ...Array(3).fill().map(() => Array(w).fill(0)),
            ...Array(1).fill().map(() => Array(w).fill(8)),
            ...Array(1).fill().map(() => Array(w).fill(16)),
            ...Array(1).fill().map(() => Array(w).fill(24)),
            ...Array(3).fill().map(() => Array(w).fill(32)),
            ...Array(1).fill().map(() => Array(w).fill(40)),
            ...Array(1).fill().map(() => Array(w).fill(48)),
            ...Array(5).fill().map(() => Array(w).fill(0)),
            ...Array(1).fill().map(() => Array(w).fill(36)),
            ...Array(1).fill().map(() => Array(w).fill(44)),
            ...Array(5).fill().map(() => Array(w).fill(26)),
        ]
    },
    main: {
        width: w * 2,
        height: 23,
        tiles: tileConfig,
        stages: [
            {data: baseStage1()},
            {data: baseStage1()},
        ]
    }
};

// Baldosas sobre línea de arbustos en introducción
mapsData.introduction.data[4].splice(0,3,56,56,43);
mapsData.introduction.data[4].splice(5,2,46,0);
mapsData.introduction.data[4].splice(9,6,56,56,56,56,56,43);
mapsData.introduction.data[4].splice(20,1,43);

//mapsData.introduccion.data[4].splice(9,1,43); //No parece ser nada
mapsData.introduction.data[4].splice(16,2,46,0); //Arbusto lado derecho

// Bancos en introducción
mapsData.introduction.data[4].splice(6,3,49,50,51);
mapsData.introduction.data[5].splice(6,3,57,58,59);
mapsData.introduction.data[4].splice(17,3,49,50,51);
mapsData.introduction.data[5].splice(17,3,57,58,59);


// Líneas calle en fondo estático
mapsData.staticBackground.data[6].splice(1,4,1,2,2,3);
mapsData.staticBackground.data[7].splice(1,4,9,10,10,11);
mapsData.staticBackground.data[6].splice(9,4,1,2,2,3);
mapsData.staticBackground.data[7].splice(9,4,9,10,10,11);

// Líneas calle en escenario [0]
mapsData.main.stages[0].data[7].splice(1,4,1,2,2,3);
mapsData.main.stages[0].data[8].splice(1,4,9,10,10,11);
mapsData.main.stages[0].data[7].splice(9,4,1,2,2,3);
mapsData.main.stages[0].data[8].splice(9,4,9,10,10,11);

// Bancos en escenario [0]
mapsData.main.stages[0].data[2].splice(2,3,49,50,51);
mapsData.main.stages[0].data[3].splice(2,3,57,58,59);
mapsData.main.stages[0].data[2].splice(7,3,49,50,51);
mapsData.main.stages[0].data[3].splice(7,3,57,58,59);

// Macetas en escenario [0]
mapsData.main.stages[0].data[2].splice(0,2,33,34);
mapsData.main.stages[0].data[3].splice(0,2,41,42);
mapsData.main.stages[0].data[2].splice(5,2,33,34);
mapsData.main.stages[0].data[3].splice(5,2,41,42);
mapsData.main.stages[0].data[2].splice(10,2,33,34);
mapsData.main.stages[0].data[3].splice(10,2,41,42);

export default mapsData;