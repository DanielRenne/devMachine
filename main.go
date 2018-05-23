package main

import (
	"net/http"
	"os"

	"github.com/DanielRenne/GoCore/core/app"
	"github.com/DanielRenne/GoCore/core/ginServer"
	"github.com/gin-gonic/gin"
)

type test struct {
	Payload string `json:"payload"`
}

func main() {
	goPath := os.Getenv("GOPATH")
	err := app.Initialize(goPath+"/src/github.com/DanielRenne/App3", "webConfig.json")
	if err == nil {
		ginServer.Router.GET("/", func(c *gin.Context) {
			c.File(goPath + "/src/github.com/DanielRenne/App3/web/dist/index.html")
		})
		ginServer.Router.GET("/page/:fileName", func(c *gin.Context) {
			c.File(goPath + "/src/github.com/DanielRenne/App3/web/dist/index.html")
		})

		ginServer.Router.GET("/test", func(c *gin.Context) {
			var t test
			t.Payload = "1244"
			c.JSON(http.StatusOK, t)
		})
		app.Run()
	}
}
