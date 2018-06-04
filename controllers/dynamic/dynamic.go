package dynamic

import (
	"github.com/DanielRenne/GoCore/core/app/api"
)

type Dynamic struct{}

func init() {
	api.RegisterController(&Dynamic{})
}

func (d *Dynamic) Root(uriParams interface{}) (y interface{}) {
	var payload struct {
		Payload string `json:"payload"`
	}
	payload.Payload = "1234"

	y = payload
	return
}
