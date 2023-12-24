package build

import (
	"bufio"
	"fmt"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

func processCIDR(cidr string, wg *sync.WaitGroup, results chan<- string) {
	defer wg.Done()
	results <- "IP-CIDR," + cidr
}

func BuildChnCidr(wg *sync.WaitGroup) {
	defer wg.Done()
	now := time.Now()
	fileUrl := "https://raw.githubusercontent.com/misakaio/chnroutes2/master/chnroutes.txt"
	resp, err := http.Get(fileUrl)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	out, err := os.Create("./Source/ip/china_ip.conf")
	if err != nil {
		panic(err)
	}
	defer out.Close()
	var sub_wg sync.WaitGroup
	results := make(chan string)

	scanner := bufio.NewScanner(resp.Body)
	for scanner.Scan() {
		line := scanner.Text()
		if !strings.HasPrefix(line, "#") {
			sub_wg.Add(1)
			go processCIDR(line, &sub_wg, results)
		}
	}
	go func() {
		sub_wg.Wait()
		close(results)
	}()
	lines := make([]string, 0)
	for result := range results {
		lines = append(lines, result)
	}
	for i, line := range lines {
		if i == len(lines)-1 {
			_, err = out.WriteString(line)
			if err != nil {
				panic(err)
			}
		} else {
			_, err = out.WriteString(line + "\n")
			if err != nil {
				panic(err)
			}
		}
	}
	if err := scanner.Err(); err != nil {
		panic(err)
	}
	end := time.Now()
	elapsed := end.Sub(now)
	fmt.Printf("Build chn cidr time: %v\n", elapsed)
}
