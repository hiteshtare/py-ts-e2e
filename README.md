# Install dependecies
RUN npm install

# Exec Build command
RUN npm run build

# Serve the app
RUN npm start
