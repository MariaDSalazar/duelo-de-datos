# Duelo de Datos

Juego de preguntas en vivo sobre bases de datos relacionales, con salas, PIN y podio.

## Cómo se juega

1. El anfitrión abre `docente.html`, crea una sala y proyecta el PIN.
2. Cada jugador abre `index.html` en su celular, escribe el PIN, su nombre y su apellido.
3. El anfitrión avanza pregunta por pregunta; cada una tiene su tiempo según lo que haya que leer.
4. Al final aparece el podio y se pueden descargar los resultados en CSV.

## Puntuación

- Acierto: de 500 a 1000 puntos según la rapidez. Algunas preguntas valen el doble.
- Racha: +100 por cada acierto seguido a partir del segundo (máximo +300).
- Equivocarse no resta. Si hay empate, gana quien acumuló menos tiempo.

## Cómo funciona

- Página estática; la comunicación en vivo usa Firebase Realtime Database con inicio de sesión anónimo.
- El banco de preguntas (`banco.js`) está cifrado con AES-GCM y solo se abre en la pantalla del anfitrión, con su clave: enlace `docente.html#docente=<clave>` o escribiéndola al abrir la página.
- Al abrir cada pregunta, el anfitrión publica solo el enunciado y las opciones; la respuesta correcta y la explicación llegan a los celulares cuando la pregunta se cierra.
- Las reglas de la base (`database.rules.json`) solo dejan que cada jugador escriba su propia respuesta, una vez, mientras la pregunta está abierta; solo el anfitrión controla la sala.

## Actualizar las preguntas

Editar `preguntas.json` (archivo local, no se publica) y volver a cifrar; el script revisa cada pregunta antes de generar `banco.js`:

```
node cifrar.mjs <clave-anfitrion>
```

## Ejecutar en local

En `localhost` el juego se conecta al emulador de Firebase en lugar de la base real (requiere Node y Java 21 o superior):

```
npx firebase-tools emulators:start --only database,auth --project demo-duelo
python -m http.server 8000
```

El anfitrión entra en `http://localhost:8000/docente.html#docente=<clave-anfitrion>`.
