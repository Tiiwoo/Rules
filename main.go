package main

import (
	"Rules/build"
	"fmt"
	"sync"
	"time"
)

func main() {
	now := time.Now()
	fmt.Println("Start build...")
	var wg sync.WaitGroup
	wg.Add(4)
	go build.BuildAppleTpl(&wg)
	go build.BuildAppleCdn(&wg)
	go build.BuildChnCidr(&wg)
	go build.Build1stream(&wg)
	wg.Wait()
	build.BuildPublic()
	fmt.Println("Build done!")
	end := time.Now()
	elapsed := end.Sub(now)
	fmt.Printf("Total build time: %v\n", elapsed)
}
