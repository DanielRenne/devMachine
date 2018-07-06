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
	// x, err := coreStore.Get(vm.Collection, vm.ID, vm.Joins)
	// if err != nil {
	// 	message := "Failed to retrieve entity.  Get->Collection:  " + vm.Collection + "\r\n  Id:  " + vm.ID + "\r\n" + fmt.Sprintf("%+v", vm)
	// }
	return
}

//GetByPath returns an entity field value from a collection store.
func (sc *StoreController) GetByPath(vm storePostPayload) (y interface{}) {

	y, _ = coreStore.GetByPath(vm.Collection, vm.ID, vm.Joins, vm.Path)
	// if err != nil {
	// 	message := ""
	// 	if settings.AppSettings.DeveloperMode {
	// 		message = "Failed to retrieve entity.  GetByPath->Collection:  " + vm.Collection + "\r\n  Id:  " + vm.ID + "\r\n" + fmt.Sprintf("%+v", vm)
	// 	}
	// 	respond(constants.PARAM_REDIRECT_NONE, message, constants.PARAM_SNACKBAR_TYPE_ERROR, err, constants.PARAM_TRANSACTION_ID_NONE, viewModel.EmptyViewModel{})
	// 	return
	// }

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
