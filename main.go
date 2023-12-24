package main

import (
	"Rules/build"
	"fmt"
	"sync"
)

func main() {
	fmt.Println("Start build...")
	var wg sync.WaitGroup
	wg.Add(3)
	go build.BuildAppleTpl(&wg)
	go build.BuildAppleCdn(&wg)
	go build.BuildChnCidr(&wg)
	wg.Wait()
	fmt.Println("Build done!")
}
