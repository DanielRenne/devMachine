//Package store provides controller functions for store interactions.
package store

import (
	"log"

	"github.com/DanielRenne/GoCore/core/app"
	"github.com/DanielRenne/GoCore/core/app/api"
	coreStore "github.com/DanielRenne/GoCore/core/store"
)

const (
	storeKey = "Store"
)

//StoreController is an api controller for interacting with the GoCore Data Store.
type StoreController struct{}

func init() {
	api.RegisterController(&StoreController{})
}

type storePostPayload struct {
	Collection    string                 `json:"Collection"`
	ID            string                 `json:"Id"`
	Filter        map[string]interface{} `json:"Filter"`
	InFilter      map[string]interface{} `json:"InFilter"`
	ExcludeFilter map[string]interface{} `json:"ExcludeFilter"`
	Joins         []string               `json:"Joins"`
	Path          string                 `json:"Path"`
	Paths         []string               `json:"Paths"`
	Value         interface{}            `json:"Value"`
}

//storePubPayload provides a serializable json struct for responding to store requests.
type storePubPayload struct {
	Collection string      `json:"Collection"`
	ID         string      `json:"Id"`
	Path       string      `json:"Path"`
	Value      interface{} `json:"Value"`
	Error      string      `json:"Error"`
	Message    string      `json:"Message"`
}

type emptyViewModel struct{}

func init() {
	c := &StoreController{}
	api.RegisterController(c)
	coreStore.OnChange = c.onStoreChange
}

func (sc *StoreController) onStoreChange(key string, id string, path string, x interface{}, err error) {
	var vm storePubPayload
	vm.Collection = key
	vm.ID = id
	vm.Path = path
	vm.Value = x
	if err != nil {
		vm.Error = err.Error()
	}

	go app.PublishWebSocketJSON(storeKey, vm)
}

//Get returns an entity from a collection store.
func (sc *StoreController) Get(vm storePostPayload) (y interface{}) {
	y, _ = coreStore.Get(vm.Collection, vm.ID, vm.Joins)
	return
}

//GetByPath returns an entity field value from a collection store.
func (sc *StoreController) GetByPath(vm storePostPayload) (y interface{}) {
	y, _ = coreStore.GetByPath(vm.Collection, vm.ID, vm.Joins, vm.Path)
	return
}

//GetByPathBatch returns an array of entity field value from a collection store.
func (sc *StoreController) GetByPathBatch(vm storePostPayload) (y interface{}) {
	y, _ = coreStore.GetByPathBatch(vm.Collection, vm.ID, vm.Joins, vm.Paths)
	return
}

//GetByFilter returns an array of entities from a collection store.
func (sc *StoreController) GetByFilter(vm storePostPayload) (y interface{}) {
	y, _ = coreStore.GetByFilter(vm.Collection, vm.Filter, vm.InFilter, vm.ExcludeFilter, vm.Joins)
	return
}

//Set sets an entity field in the collection store.
func (sc *StoreController) Set(vm storePostPayload) (y interface{}) {

	logMessage := func(topic string, message string) {
		log.Println(topic + "\n" + message)
	}

	coreStore.Set(vm.Collection, vm.ID, vm.Path, vm.Value, logMessage)
	y = emptyViewModel{}
	return
}

//Remove removes the document from the collection.
func (*StoreController) Remove(vm storePostPayload) (y interface{}) {

	coreStore.Remove(vm.Collection, vm.ID)
	y = emptyViewModel{}
	return

}

//Publish will fetch the store record and publish to all subscribers.
func (sc *StoreController) Publish(vm storePostPayload) (y interface{}) {

	logMessage := func(topic string, message string) {
		log.Println(topic + "\n" + message)
	}

	coreStore.Publish(vm.Collection, vm.ID, vm.Path, logMessage)
	y = emptyViewModel{}
	return
}

//Add creates a new collection object to the collection
func (*StoreController) Add(vm storePostPayload) (y interface{}) {

	logMessage := func(topic string, message string) {
		log.Println(topic + "\n" + message)
	}

	y, _ = coreStore.Add(vm.Collection, vm.Value, logMessage)
	return
}

//Append adds a new row object to a collection path
func (*StoreController) Append(vm storePostPayload) (y interface{}) {

	logMessage := func(topic string, message string) {
		log.Println(topic + "\n" + message)
	}

	y, _ = coreStore.Append(vm.Collection, vm.ID, vm.Path, vm.Value, logMessage)

	return
}
