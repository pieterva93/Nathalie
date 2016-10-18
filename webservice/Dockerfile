FROM node
#create app directory
RUN mkdir -p C:/Users/pieter/WebstormProjects/webservice1
WORKDIR C:/Users/pieter/WebstormProjects/webservice1

#install app dependencies

COPY package.json C:/Users/pieter/WebstormProjects/webservice
RUN npm install



# bundle app source

ADD . C:/Users/pieter/WebstormProjects/webservice



EXPOSE 3000
CMD ["npm", "start"]







