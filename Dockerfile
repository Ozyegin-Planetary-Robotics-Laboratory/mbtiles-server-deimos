FROM node:18.17-alpine

COPY . .

RUN yarn

EXPOSE 3000

ENV NAME="mbtiles-serve"

CMD ["yarn", "start", "tiles.mbtiles", "--port", "3000"]