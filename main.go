package main

import (
	"Rules/build"
	"fmt"
	"log"
	"net/http"
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
	build.BuildPublic()
	fmt.Println("Build done!")
	// 设置静态文件服务的根目录
	fs := http.FileServer(http.Dir("./"))

	// 将根URL路径（"/"）映射到文件服务器
	http.Handle("/", fs)

	// 启动HTTP服务器并监听8080端口
	log.Println("Listening on :8080...")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal(err)
	}
}
