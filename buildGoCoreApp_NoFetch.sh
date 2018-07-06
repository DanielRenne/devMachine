cwd=$(pwd)
emptyString=""
goPathAndSource=$GOPATH/src/
#Add Translation Tools
go install github.com/DanielRenne/addTranslation
go install github.com/DanielRenne/updateTranslation

mkdir -p $1

cp -r keys/ $1/keys
cp -r db/ $1/db
cp -r controllers/ $1/controllers
cp -r modelBuild/ $1/modelBuild
cp -r models/ $1/models
cp webConfig.json $1

cd $1

cp $GOPATH/bin/addTranslation addTranslation
cp $GOPATH/bin/updateTranslation updateTranslation

echo -e '{
    "key":"YourAPIKey",
    "path":"web/pages",
    "languages":[
        "es"
    ]
}' > yandex.json



directoryName=${PWD##*/} 

echo -e 'package main

import (
	"github.com/DanielRenne/GoCore/core/app"
    "github.com/DanielRenne/GoCore/core/app/api"
	"github.com/DanielRenne/GoCore/core/ginServer"
    _ "'${1/${goPathAndSource}/${emptyString}}'/controllers"
	_ "'${1/${goPathAndSource}/${emptyString}}'/models/v1/model"
	"github.com/gin-gonic/gin"
)

func main() {
	
	err := app.Initialize("'$1'", "webConfig.json")
	if err == nil {
		ginServer.Router.GET("/", func(c *gin.Context) {
			c.File("'$1'/web/dist/index.html")
		})
		ginServer.Router.GET("/page/:fileName", func(c *gin.Context) {
			c.File("'$1'/web/dist/index.html")
		})

        ginServer.Router.GET("/apiGET", api.APICallback)
		ginServer.Router.POST("/apiPOST", api.APICallback)
		app.RegisterWebSocketDataCallback(api.SocketAPICallback)
		app.Run()
	}
}' > main.go

echo -e 'package main

import (
	"os"
	
	"github.com/DanielRenne/GoCore/buildCore"
)

func main() {

	goPath := os.Getenv("GOPATH")

	buildCore.GenerateModels(goPath+"/src/'${1/${goPathAndSource}/${emptyString}}'", "webConfig.json")
}' > modelBuild/main.go



echo -e 'package controllers

import (
	_ "'${1/${goPathAndSource}/${emptyString}}'/controllers/dynamic"
	_ "'${1/${goPathAndSource}/${emptyString}}'/controllers/store"
)' > controllers/controllers.go

mkdir -p $1/bin
mkdir -p $1/db/schemas/1.0.0
mkdir -p $1/db/goFiles
mkdir -p $1/db/bootstrap

cd $cwd

./buildApp.sh $1

cd $1

go run modelBuild/main.go

# if which xdg-open > /dev/null
# then
#   xdg-open "localhost:8080"
# elif which gnome-open > /dev/null
# then
#   gnome-open "localhost:8080"
# fi

# go run main.go


