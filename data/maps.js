const w = 15;

const escenarioBase1 = () => [
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

const tileCofig = {
    tileWidth: 48,
    tileHeight: 48,
    tileSet: "bgtiles",
};

const mapsData = {
    introduccion: {
        width: 25,
        height: 7,
        tiles: tileCofig,
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
    fondoEstatico: {
        width: w,
        height: 23,
        tiles: tileCofig,
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
        tiles: tileCofig,
        escenarios: [
            {data: escenarioBase1()},
            {data: escenarioBase1()},
        ]
    }
};

// Baldosas sobre línea de arbustos en introducción
mapsData.introduccion.data[4].splice(0,3,56,56,43);
mapsData.introduccion.data[4].splice(5,2,46,0);
mapsData.introduccion.data[4].splice(9,6,56,56,56,56,56,43);
mapsData.introduccion.data[4].splice(20,1,43);

//mapsData.introduccion.data[4].splice(9,1,43); //No parece ser nada
mapsData.introduccion.data[4].splice(16,2,46,0); //Arbusto lado derecho

// Bancos en introducción
mapsData.introduccion.data[4].splice(6,3,49,50,51);
mapsData.introduccion.data[5].splice(6,3,57,58,59);
mapsData.introduccion.data[4].splice(17,3,49,50,51);
mapsData.introduccion.data[5].splice(17,3,57,58,59);


// Líneas calle en fondo estático
mapsData.fondoEstatico.data[6].splice(1,4,1,2,2,3);
mapsData.fondoEstatico.data[7].splice(1,4,9,10,10,11);
mapsData.fondoEstatico.data[6].splice(9,4,1,2,2,3);
mapsData.fondoEstatico.data[7].splice(9,4,9,10,10,11);

// Líneas calle en escenario [0]
mapsData.main.escenarios[0].data[7].splice(1,4,1,2,2,3);
mapsData.main.escenarios[0].data[8].splice(1,4,9,10,10,11);
mapsData.main.escenarios[0].data[7].splice(9,4,1,2,2,3);
mapsData.main.escenarios[0].data[8].splice(9,4,9,10,10,11);

// Bancos en escenario [0]
mapsData.main.escenarios[0].data[2].splice(2,3,49,50,51);
mapsData.main.escenarios[0].data[3].splice(2,3,57,58,59);
mapsData.main.escenarios[0].data[2].splice(7,3,49,50,51);
mapsData.main.escenarios[0].data[3].splice(7,3,57,58,59);

// Macetas en escenario [0]
mapsData.main.escenarios[0].data[2].splice(0,2,33,34);
mapsData.main.escenarios[0].data[3].splice(0,2,41,42);
mapsData.main.escenarios[0].data[2].splice(5,2,33,34);
mapsData.main.escenarios[0].data[3].splice(5,2,41,42);
mapsData.main.escenarios[0].data[2].splice(10,2,33,34);
mapsData.main.escenarios[0].data[3].splice(10,2,41,42);

export default mapsData;