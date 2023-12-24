package main

import (
	"Rules/build"
	"fmt"
	"sync"
)

func main() {
	fmt.Println("Start build...")
	var wg sync.WaitGroup
	wg.Add(2)
	go build.BuildAppleTpl(&wg)
	go build.BuildAppleCdn(&wg)
	wg.Wait()
	fmt.Println("Build done!")
}
