# mbtiles-serve

Fast HTTP server serving map tiles directly from a mbtiles file. It is built on the mapbox [node-mbtiles](https://github.com/mapbox/node-mbtiles) library without any other dependencies (apart cli meow). Repository was forked from the original.

## Usage

You will need to build the Docker image and run the container in order to host the server.

```sh
docker build -t toprakefe722/mbtiles-server-deimos .

docker run -p 3000:3000 toprakefe722/mbtiles-server-deimos:latest
```

The end point is "http://localhost:3000/?z={z}&x={x}&y={y}.png".

## Development

First, you need to clone the repository to your local computer, however, to fetch the tileset you will need to use a second fetch command with `git lfs`.

```sh
git clone https://www.github.com/Ozyegin-Planetary-Robotics-Laboratory/mbtiles-server-deimos.git

git lfs fetch --all
```

### Server Development

PRs are more than welcome. Start by installing all the dependencies with

```sh
yarn
```

You can run it directly from the repo by

```sh
yarn start tiles.mbtiles --port 3000
```

Once you are happy with your changes you can push to the repository right away.

### Map Development

You can overwrite the local tiles.mbtiles file with your own tileset. The ideal toolset for this is [QGIS](https://qgis.org/en/site/).
