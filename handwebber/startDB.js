'use strict';

require('dotenv').config();

const readline = require('readline');

// conectar a la base de datos
const connection = require('./lib/connectMongoose');

// cargar los modelos
const { User } = require('./models');

async function main() {

  const continuar = await pregunta('Estas seguro, seguro, seguro, de que quieres borrar toda la base de datos y cargar datos iniciales');
  if (!continuar) {
    process.exit();
  }

  //Inicializamos la colección de usuarios
  await initUsers();

  connection.close();

}

main().catch(err => console.log('Hubo un error:', err));

async function initUsers() {
  // borrar todos los documentos de agentes
  const deleted = await User.deleteMany();
  console.log(`Eliminados ${deleted.deletedCount} usuarios.`);

  // crear usuarios iniciales
  const inserted = await User.insertMany([
    { username: 'jossid',
    mail: 'alfredvays@gmail.com',
    password: await User.hashPassword('1234'),
    image: '',
    subscriptions: [],
    creation: Date.now(),
    update: Date.now()
    },
  ]);
  console.log(`Creados ${inserted.length} usuarios.`);
};

function pregunta(texto) {
  return new Promise((resolve, reject) => {

    const ifc = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    ifc.question(texto, respuesta => {
      ifc.close();
      if (respuesta.toLowerCase() === 'si') {
        resolve(true);
        return;
      }
      resolve(false);
    });

  });

};