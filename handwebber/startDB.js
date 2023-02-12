'use strict';

require('dotenv').config();

const readline = require('readline');

// conectar a la base de datos
const connection = require('./lib/connectMongoose');

// cargar los modelos
const { User, Advertisement } = require('./models');

async function main() {
  await connection.$initialConnection;
  const continuar = await pregunta(
    'Estas seguro, seguro, seguro, de que quieres borrar toda la base de datos y cargar datos iniciales (si/NO): '
  );
  if (!continuar) {
    process.exit();
  }

  //Import Data File
  const adsFile = require('./baseAds.json');

  //Inicializamos la colección de usuarios
  await initUsers(adsFile.users);

  //Initializing ads collection
  await initAds(adsFile.advertisements);

  connection.close();
}

main().catch((err) => console.log('Hubo un error:', err));

async function initUsers(data) {
  // borrar todos los documentos de usuarios
  const deleted = await User.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  let newData = [...data];
  const password = await User.hashPassword('1234');

  // crear usuarios iniciales
  for (let index = 0; index < newData.length; index++) {
    newData[index].password = password;
    newData[index].creation = Date.now();
    newData[index].update = Date.now();
  }

  const inserted = await User.insertMany(newData);
  console.log(`Creados ${inserted.length} usuarios.`);
}

async function initAds(data) {
  //erase all the advertisements
  const deleted = await Advertisement.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} anuncios`);

  //Synchronize the indexes
  const syncIndex = await Advertisement.syncIndexes();
  console.log(`Reviewed ${syncIndex} index`);

  //creating intials ads
  let newData = [...data];
  for (let index = 0; index < newData.length; index++) {
    newData[index].creation = Date.now();
    newData[index].update = Date.now();
  }

  const inserted = await Advertisement.insertMany(newData);
  console.log(`Created ${inserted.length} advertisements.`);
}

function pregunta(texto) {
  return new Promise((resolve, reject) => {
    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    ifc.question(texto, (respuesta) => {
      ifc.close();
      if (respuesta.toLowerCase() === 'si') {
        resolve(true);
        return;
      }
      resolve(false);
    });
  });
}
