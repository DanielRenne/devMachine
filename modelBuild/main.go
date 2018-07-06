package main

import (
	"os"

	"github.com/DanielRenne/GoCore/buildCore"
)

func main() {

	goPath := os.Getenv("GOPATH")

	buildCore.GenerateModels(goPath+"/src/github.com/DanielRenne/nextGenApp", "webConfig.json")
}
