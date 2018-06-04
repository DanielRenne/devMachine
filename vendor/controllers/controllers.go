package controllers

import (
	"reflect"
	"sync"
)

var registry sync.Map

func getController(key string) *reflect.Value {
	controller, ok := getControllerRegistry(key)
	if ok {
		return &controller
	}
	return nil
}

//RegisterController will register the type to be reflected for controller requests by the name of the type.
func RegisterController(controller interface{}) {
	registry.Store(getType(controller), reflect.ValueOf(controller))
}

//RegisterControllerByKey will register the type to be reflected for controller requests by a custom key.
func RegisterControllerByKey(key string, controller interface{}) {
	registry.Store(key, reflect.ValueOf(controller))
}

func getControllerRegistry(key string) (controller reflect.Value, ok bool) {

	obj, ok := registry.Load(key)
	if ok {
		controller = obj.(reflect.Value)
	}
	return
}

func getType(myvar interface{}) string {

	if t := reflect.TypeOf(myvar); t.Kind() == reflect.Ptr {
		return t.Elem().Name()
	} else {
		return t.Name()
	}
}
