FROM node


COPY . /random-chat-ui

WORKDIR /random-chat-ui

COPY . .

RUN npm install

CMD ["npm","run","dev"]